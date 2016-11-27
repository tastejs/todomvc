port module Todo exposing (..)

{-| TodoMVC implemented in Elm, using plain HTML and CSS for rendering.

This application is broken up into four distinct parts:

  1. Model  - a full description of the application as data
  2. Update - a way to update the model based on user actions
  3. View   - a way to visualize our model with HTML

This program is not particularly large, so definitely see the following
document for notes on structuring more complex GUIs with Elm:
http://guide.elm-lang.org/architecture/
-}

import Dom
import Task
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy, lazy2)
import Html.App
import Navigation exposing (Parser)
import String
import String.Extra
import Todo.Task


-- MODEL
-- The full application state of our todo app.


type alias Model =
    { tasks : List Todo.Task.Model
    , field : String
    , uid : Int
    , visibility : String
    }


type alias Flags =
    Maybe Model


emptyModel : Model
emptyModel =
    { tasks = []
    , visibility = "All"
    , field = ""
    , uid = 0
    }



-- UPDATE
-- A description of the kinds of actions that can be performed on the model of
-- our application. See the following post for more info on this pattern and
-- some alternatives: http://guide.elm-lang.org/architecture/


type Msg
    = NoOp
    | UpdateField String
    | Add
    | UpdateTask ( Int, Todo.Task.Msg )
    | DeleteComplete
    | CheckAll Bool
    | ChangeVisibility String



-- How we update our Model on any given Message


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case Debug.log "MESSAGE: " msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateField str ->
            let
                newModel =
                    { model | field = str }
            in
                ( newModel, save model )

        Add ->
            let
                description =
                    String.trim model.field

                newModel =
                    if String.isEmpty description then
                        model
                    else
                        { model
                            | uid = model.uid + 1
                            , field = ""
                            , tasks = model.tasks ++ [ Todo.Task.init description model.uid ]
                        }
            in
                ( newModel, save newModel )

        UpdateTask ( id, taskMsg ) ->
            let
                updateTask t =
                    if t.id == id then
                        Todo.Task.update taskMsg t
                    else
                        Just t

                newModel =
                    { model | tasks = List.filterMap updateTask model.tasks }
            in
                case taskMsg of
                    Todo.Task.Focus elementId ->
                        newModel ! [ save newModel, focusTask elementId ]

                    _ ->
                        ( newModel, save newModel )

        DeleteComplete ->
            let
                newModel =
                    { model
                        | tasks = List.filter (not << .completed) model.tasks
                    }
            in
                ( newModel, save newModel )

        CheckAll bool ->
            let
                updateTask t =
                    { t | completed = bool }

                newModel =
                    { model | tasks = List.map updateTask model.tasks }
            in
                ( newModel, save newModel )

        ChangeVisibility visibility ->
            let
                newModel =
                    { model | visibility = visibility }
            in
                ( newModel, save model )


focusTask : String -> Cmd Msg
focusTask elementId =
    Task.perform (\_ -> NoOp) (\_ -> NoOp) (Dom.focus elementId)



-- VIEW


view : Model -> Html Msg
view model =
    div
        [ class "todomvc-wrapper"
        , style [ ( "visibility", "hidden" ) ]
        ]
        [ section
            [ class "todoapp" ]
            [ lazy taskEntry model.field
            , lazy2 taskList model.visibility model.tasks
            , lazy2 controls model.visibility model.tasks
            ]
        , infoFooter
        ]


taskEntry : String -> Html Msg
taskEntry task =
    header
        [ class "header" ]
        [ h1 [] [ text "todos" ]
        , input
            [ class "new-todo"
            , placeholder "What needs to be done?"
            , autofocus True
            , value task
            , name "newTodo"
            , onInput UpdateField
            , Todo.Task.onFinish Add NoOp
            ]
            []
        ]


taskList : String -> List Todo.Task.Model -> Html Msg
taskList visibility tasks =
    let
        isVisible todo =
            case visibility of
                "Completed" ->
                    todo.completed

                "Active" ->
                    not todo.completed

                -- "All"
                _ ->
                    True

        allCompleted =
            List.all .completed tasks

        cssVisibility =
            if List.isEmpty tasks then
                "hidden"
            else
                "visible"
    in
        section
            [ class "main"
            , style [ ( "visibility", cssVisibility ) ]
            ]
            [ input
                [ class "toggle-all"
                , type' "checkbox"
                , name "toggle"
                , checked allCompleted
                , onClick (CheckAll (not allCompleted))
                ]
                []
            , label
                [ for "toggle-all" ]
                [ text "Mark all as complete" ]
            , ul
                [ class "todo-list" ]
                (List.map
                    (\task ->
                        let
                            id =
                                task.id

                            taskView =
                                Todo.Task.view task
                        in
                            Html.App.map (\msg -> UpdateTask ( id, msg )) taskView
                    )
                    (List.filter isVisible tasks)
                )
            ]


controls : String -> List Todo.Task.Model -> Html Msg
controls visibility tasks =
    let
        tasksCompleted =
            List.length (List.filter .completed tasks)

        tasksLeft =
            List.length tasks - tasksCompleted

        item_ =
            if tasksLeft == 1 then
                " item"
            else
                " items"
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
                [ visibilitySwap "#/" "All" visibility
                , text " "
                , visibilitySwap "#/active" "Active" visibility
                , text " "
                , visibilitySwap "#/completed" "Completed" visibility
                ]
            , button
                [ class "clear-completed"
                , hidden (tasksCompleted == 0)
                , onClick DeleteComplete
                ]
                [ text ("Clear completed (" ++ toString tasksCompleted ++ ")") ]
            ]


visibilitySwap : String -> String -> String -> Html Msg
visibilitySwap uri visibility actualVisibility =
    let
        className =
            if visibility == actualVisibility then
                "selected"
            else
                ""
    in
        li
            [ onClick (ChangeVisibility visibility) ]
            [ a [ class className, href uri ] [ text visibility ] ]


infoFooter : Html msg
infoFooter =
    footer
        [ class "info" ]
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



-- wire the entire application together


main : Program Flags
main =
    Navigation.programWithFlags urlParser
        { urlUpdate = urlUpdate
        , view = view
        , init = init
        , update = update
        , subscriptions = subscriptions
        }



-- URL PARSERS - check out evancz/url-parser for fancier URL parsing


toUrl : String -> String
toUrl visibility =
    "#/" ++ String.toLower visibility


fromUrl : String -> Maybe String
fromUrl hash =
    let
        cleanHash =
            String.dropLeft 2 hash
    in
        if (List.member cleanHash [ "all", "active", "completed" ]) == True then
            Just cleanHash
        else
            Nothing


urlParser : Parser (Maybe String)
urlParser =
    Navigation.makeParser (fromUrl << .hash)


{-| The URL is turned into a Maybe value. If the URL is valid, we just update
our model with the new visibility settings. If it is not a valid URL,
we set the visibility filter to show all tasks.
-}
urlUpdate : Maybe String -> Model -> ( Model, Cmd Msg )
urlUpdate result model =
    case result of
        Just visibility ->
            update (ChangeVisibility (String.Extra.toSentenceCase visibility)) model

        Nothing ->
            update (ChangeVisibility "All") model


init : Flags -> Maybe String -> ( Model, Cmd Msg )
init flags url =
    urlUpdate url (Maybe.withDefault emptyModel flags)



-- interactions with localStorage


port save : Model -> Cmd msg


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
