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
http://elm-lang.org/learn/Architecture.elm
-}

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy, lazy2, lazy3)
import Json.Decode as Json
import Signal exposing (Signal, Address)
import String
import Window

---- MODEL ----

-- The full application state of our todo app.
type alias Model =
    { tasks : List Task
    , field : String
    , uid : Int
    , visibility : String
    }


type alias Task =
    { description : String
    , completed : Bool
    , editing : Bool
    , id : Int
    }


newTask : String -> Int -> Task
newTask desc id =
    { description = desc
    , completed = False
    , editing = False
    , id = id
    }


emptyModel : Model
emptyModel =
    { tasks = []
    , visibility = "All"
    , field = ""
    , uid = 0
    }


---- UPDATE ----

-- A description of the kinds of actions that can be performed on the model of
-- our application. See the following post for more info on this pattern and
-- some alternatives: http://elm-lang.org/learn/Architecture.elm
type Action
    = NoOp
    | UpdateField String
    | EditingTask Int Bool
    | UpdateTask Int String
    | Add
    | Delete Int
    | DeleteComplete
    | Check Int Bool
    | CheckAll Bool
    | ChangeVisibility String


-- How we update our Model on a given Action?
update : Action -> Model -> Model
update action model =
    case action of
      NoOp -> model

      Add ->
          { model |
              uid <- model.uid + 1,
              field <- "",
              tasks <-
                  if String.isEmpty model.field
                    then model.tasks
                    else model.tasks ++ [newTask model.field model.uid]
          }

      UpdateField str ->
          { model | field <- str }

      EditingTask id isEditing ->
          let updateTask t = if t.id == id then { t | editing <- isEditing } else t
          in
              { model | tasks <- List.map updateTask model.tasks }

      UpdateTask id task ->
          let updateTask t = if t.id == id then { t | description <- task } else t
          in
              { model | tasks <- List.map updateTask model.tasks }

      Delete id ->
          { model | tasks <- List.filter (\t -> t.id /= id) model.tasks }

      DeleteComplete ->
          { model | tasks <- List.filter (not << .completed) model.tasks }

      Check id isCompleted ->
          let updateTask t = if t.id == id then { t | completed <- isCompleted } else t
          in
              { model | tasks <- List.map updateTask model.tasks }

      CheckAll isCompleted ->
          let updateTask t = { t | completed <- isCompleted }
          in
              { model | tasks <- List.map updateTask model.tasks }

      ChangeVisibility visibility ->
          { model | visibility <- visibility }


---- VIEW ----

view : Address Action -> Model -> Html
view address model =
    div
      [ class "todomvc-wrapper"
      , style [ ("visibility", "hidden") ]
      ]
      [ section
          [ class "todoapp" ]
          [ lazy2 taskEntry address model.field
          , lazy3 taskList address model.visibility model.tasks
          , lazy3 controls address model.visibility model.tasks
          ]
      , infoFooter
      ]


onEnter : Address a -> a -> Attribute
onEnter address value =
    on "keydown"
      (Json.customDecoder keyCode is13)
      (\_ -> Signal.message address value)


is13 : Int -> Result String ()
is13 code =
  if code == 13 then Ok () else Err "not the right key code"


taskEntry : Address Action -> String -> Html
taskEntry address task =
    header
      [ class "header" ]
      [ h1 [] [ text "todos" ]
      , input
          [ class "new-todo"
          , placeholder "What needs to be done?"
          , autofocus True
          , value task
          , name "newTodo"
          , on "input" targetValue (Signal.message address << UpdateField)
          , onEnter address Add
          ]
          []
      ]


taskList : Address Action -> String -> List Task -> Html
taskList address visibility tasks =
    let isVisible todo =
            case visibility of
              "Completed" -> todo.completed
              "Active" -> not todo.completed
              "All" -> True

        allCompleted = List.all .completed tasks

        cssVisibility = if List.isEmpty tasks then "hidden" else "visible"
    in
    section
      [ class "main"
      , style [ ("visibility", cssVisibility) ]
      ]
      [ input
          [ class "toggle-all"
          , type' "checkbox"
          , name "toggle"
          , checked allCompleted
          , onClick address (CheckAll (not allCompleted))
          ]
          []
      , label
          [ for "toggle-all" ]
          [ text "Mark all as complete" ]
      , ul
          [ class "todo-list" ]
          (List.map (todoItem address) (List.filter isVisible tasks))
      ]


todoItem : Address Action -> Task -> Html
todoItem address todo =
    li
      [ classList [ ("completed", todo.completed), ("editing", todo.editing) ] ]
      [ div
          [ class "view" ]
          [ input
              [ class "toggle"
              , type' "checkbox"
              , checked todo.completed
              , onClick address (Check todo.id (not todo.completed))
              ]
              []
          , label
              [ onDoubleClick address (EditingTask todo.id True) ]
              [ text todo.description ]
          , button
              [ class "destroy"
              , onClick address (Delete todo.id)
              ]
              []
          ]
      , input
          [ class "edit"
          , value todo.description
          , name "title"
          , class ("todo-" ++ toString todo.id)
          , on "input" targetValue (Signal.message address << UpdateTask todo.id)
          , onBlur address (EditingTask todo.id False)
          , onEnter address (EditingTask todo.id False)
          ]
          []
      ]


controls : Address Action -> String -> List Task -> Html
controls address visibility tasks =
    let tasksCompleted = List.length (List.filter .completed tasks)
        tasksLeft = List.length tasks - tasksCompleted
        item_ = if tasksLeft == 1 then " item" else " items"
    in
    footer
      [ class "footer"
      , hidden (List.isEmpty tasks)
      ]
      [ span
          [ class "todo-count" ]
          [ strong [] [ text (toString tasksLeft) ]
          , text (item_ ++ " left")
          ]
      , ul
          [ class "filters" ]
          [ visibilitySwap address "#/" "All" visibility
          , text " "
          , visibilitySwap address "#/active" "Active" visibility
          , text " "
          , visibilitySwap address "#/completed" "Completed" visibility
          ]
      , button
          [ class "clear-completed"
          , id "clear-completed"
          , hidden (tasksCompleted == 0)
          , onClick address DeleteComplete
          ]
          [ text ("Clear completed (" ++ toString tasksCompleted ++ ")") ]
      ]


visibilitySwap : Address Action -> String -> String -> String -> Html
visibilitySwap address uri visibility actualVisibility =
    li
      [ onClick address (ChangeVisibility visibility) ]
      [ a [ href uri, classList [("selected", visibility == actualVisibility)] ] [ text visibility ] ]


infoFooter : Html
infoFooter =
    footer [ class "info" ]
      [ p [] [ text "Double-click to edit a todo" ]
      , p []
          [ text "Written by "
          , a [ href "https://github.com/evancz" ] [ text "Evan Czaplicki" ]
          ]
      , p []
          [ text "Part of "
          , a [ href "http://todomvc.com" ] [ text "TodoMVC" ]
          ]
      ]


---- INPUTS ----

-- wire the entire application together
main : Signal Html
main =
  Signal.map (view actions.address) model


-- manage the model of our application over time
model : Signal Model
model =
  Signal.foldp update initialModel actions.signal


initialModel : Model
initialModel =
  Maybe.withDefault emptyModel getStorage


-- actions from user input
actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp


port focus : Signal String
port focus =
    let needsFocus act =
            case act of
              EditingTask id bool -> bool
              _ -> False

        toSelector (EditingTask id _) = ("#todo-" ++ toString id)
    in
        actions.signal
          |> Signal.filter needsFocus (EditingTask 0 True)
          |> Signal.map toSelector


-- interactions with localStorage to save the model
port getStorage : Maybe Model

port setStorage : Signal Model
port setStorage = model
