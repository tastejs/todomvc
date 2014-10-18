module Todo where
{-| TodoMVC implemented in Elm, using plain HTML and CSS for rendering.

This application is broken up into four distinct parts:

  1. Model  - a full definition of the application's state
  2. Update - a way to step the application state forward
  3. View   - a way to visualize our application state with HTML
  4. Inputs - the signals necessary to manage events

This clean division of concerns is a core part of Elm. You can read more about
this in the Pong tutorial: http://elm-lang.org/blog/Pong.elm

This program is not particularly large, so definitely see the following
document for notes on structuring more complex GUIs with Elm:
https://gist.github.com/evancz/2b2ba366cae1887fe621
-}

import Graphics.Element (Element, container, midTop)
import Html (..)
import Html.Attributes (..)
import Html.Events (..)
import Html.Lazy (lazy, lazy2)
import List
import LocalChannel as LC
import Maybe
import Signal
import String
import Task
import Window


-- MODEL

-- The full application state of our todo app.
type alias Model =
    { tasks      : List Task.Model
    , field      : String
    , uid        : Int
    , visibility : String
    }


emptyModel : Model
emptyModel =
    { tasks = []
    , visibility = "All"
    , field = ""
    , uid = 0
    }


-- UPDATE

-- A description of the kinds of actions that can be performed on the state of
-- the application. See the following post for more info on this pattern and
-- some alternatives: https://gist.github.com/evancz/2b2ba366cae1887fe621
type Action
    = NoOp
    | UpdateField String
    | Add
    | UpdateTask (Int, Task.Action)
    | DeleteComplete
    | CheckAll Bool
    | ChangeVisibility String


-- How we step the state forward for any given action
update : Action -> Model -> Model
update action state =
    case action of
      NoOp -> state

      UpdateField str ->
          { state | field <- str }

      Add ->
          let description = String.trim state.field in
          if String.isEmpty description then state else
              { state |
                  uid <- state.uid + 1,
                  field <- "",
                  tasks <- state.tasks ++ [Task.init description state.uid]
              }

      UpdateTask (id, taskAction) ->
          let updateTask t =
                if t.id == id then Task.update taskAction t else Just t
          in
              { state | tasks <- List.filterMap updateTask state.tasks }

      DeleteComplete ->
          { state | tasks <- List.filter (not << .completed) state.tasks }

      CheckAll bool ->
          let updateTask t = { t | completed <- bool }
          in  { state | tasks <- List.map updateTask state.tasks }

      ChangeVisibility visibility ->
          { state | visibility <- visibility }


-- VIEW

view : Model -> Html
view state =
    div
      [ class "todomvc-wrapper"
      , style [ ("visibility", "hidden") ]
      ]
      [ section
          [ id "todoapp" ]
          [ lazy taskEntry state.field
          , lazy2 taskList state.visibility state.tasks
          , lazy2 controls state.visibility state.tasks
          ]
      , infoFooter
      ]

taskEntry : String -> Html
taskEntry task =
    header
      [ id "header" ]
      [ h1 [] [ text "todos" ]
      , input
          [ id "new-todo"
          , placeholder "What needs to be done?"
          , autofocus True
          , value task
          , name "newTodo"
          , on "input" targetValue (Signal.send actions << UpdateField)
          , Task.onFinish (Signal.send actions Add) (Signal.send actions NoOp)
          ]
          []
      ]

taskList : String -> List Task.Model -> Html
taskList visibility tasks =
    let isVisible todo =
            case visibility of
              "Completed" -> todo.completed
              "Active" -> not todo.completed
              "All" -> True

        allCompleted = List.all .completed tasks

        cssVisibility = if List.isEmpty tasks then "hidden" else "visible"
    in
    section
      [ id "main"
      , style [ ("visibility", cssVisibility) ]
      ]
      [ input
          [ id "toggle-all"
          , type' "checkbox"
          , name "toggle"
          , checked allCompleted
          , onClick (Signal.send actions (CheckAll (not allCompleted)))
          ]
          []
      , label
          [ for "toggle-all" ]
          [ text "Mark all as complete" ]
      , ul
          [ id "todo-list" ]
          (List.map (Task.view taskActions) (List.filter isVisible tasks))
      ]

controls : String -> List Task.Model -> Html
controls visibility tasks =
    let tasksCompleted = List.length (List.filter .completed tasks)
        tasksLeft = List.length tasks - tasksCompleted
        item_ = if tasksLeft == 1 then " item" else " items"
    in
    footer
      [ id "footer"
      , hidden (List.isEmpty tasks)
      ]
      [ span
          [ id "todo-count" ]
          [ strong [] [ text (toString tasksLeft) ]
          , text (item_ ++ " left")
          ]
      , ul
          [ id "filters" ]
          [ visibilitySwap "#/" "All" visibility
          , text " "
          , visibilitySwap "#/active" "Active" visibility
          , text " "
          , visibilitySwap "#/completed" "Completed" visibility
          ]
      , button
          [ class "clear-completed"
          , id "clear-completed"
          , hidden (tasksCompleted == 0)
          , onClick (Signal.send actions DeleteComplete)
          ]
          [ text ("Clear completed (" ++ toString tasksCompleted ++ ")") ]
      ]

visibilitySwap : String -> String -> String -> Html
visibilitySwap uri visibility actualVisibility =
    let className = if visibility == actualVisibility then "selected" else "" in
    li
      [ onClick (Signal.send actions (ChangeVisibility visibility)) ]
      [ a [ class className, href uri ] [ text visibility ] ]

infoFooter : Html
infoFooter =
    footer [ id "info" ]
      [ p [] [ text "Double-click to edit a todo" ]
      , p [] [ text "Written by "
             , a [ href "https://github.com/evancz" ] [ text "Evan Czaplicki" ]
             ]
      , p [] [ text "Part of "
             , a [ href "http://todomvc.com" ] [ text "TodoMVC" ]
             ]
      ]


-- SIGNALS

-- wire the entire application together
main : Signal Element
main =
    Signal.map2 scene model Window.dimensions


scene : Model -> (Int,Int) -> Element
scene model (w,h) =
    container w h midTop (toElement 550 h (view model))


-- manage the model of our application over time
model : Signal Model
model =
    Signal.foldp update initialModel allActions


initialModel : Model
initialModel =
    Maybe.withDefault emptyModel savedModel


allActions : Signal Action
allActions =
    Signal.merge
      (Signal.subscribe actions)
      (Signal.map ChangeVisibility route)


-- interactions with localStorage
port savedModel : Maybe Model

port save : Signal Model
port save = model

-- routing
port route : Signal String

-- actions from user input
actions : Signal.Channel Action
actions = Signal.channel NoOp

taskActions : LC.LocalChannel (Int, Task.Action)
taskActions = LC.create UpdateTask actions

port focus : Signal (Maybe Int)
port focus =
    let toSelector action =
            case action of
              UpdateTask (id, Task.Focus) -> Just id
              _ -> Nothing
    in
        Signal.map toSelector (Signal.subscribe actions)
