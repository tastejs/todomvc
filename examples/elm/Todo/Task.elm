module Todo.Task exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode
import String


-- MODEL


type alias Model =
    { description : String
    , completed : Bool
    , edits : Maybe String
    , id : Int
    }


init : String -> Int -> Model
init desc id =
    { description = desc
    , completed = False
    , edits = Nothing
    , id = id
    }



-- UPDATE


type Msg
    = Focus String
    | Edit String
    | Cancel
    | Commit
    | Completed Bool
    | Delete


update : Msg -> Model -> Maybe Model
update msg model =
    case msg of
        Focus elementId ->
            Just { model | edits = Just model.description }

        Edit description ->
            Just { model | edits = Just description }

        Cancel ->
            Just { model | edits = Nothing }

        Commit ->
            case model.edits of
                Nothing ->
                    Just model

                Just rawDescription ->
                    let
                        description =
                            String.trim rawDescription
                    in
                        if String.isEmpty description then
                            Nothing
                        else
                            Just
                                { model
                                    | edits = Nothing
                                    , description = description
                                }

        Completed bool ->
            Just { model | completed = bool }

        Delete ->
            Nothing



-- VIEW


view : Model -> Html Msg
view model =
    let
        className =
            (if model.completed then
                "completed "
             else
                ""
            )
                ++ case model.edits of
                    Just _ ->
                        "editing"

                    Nothing ->
                        ""

        description =
            Maybe.withDefault model.description model.edits

        elementId =
            "todo-" ++ toString model.id
    in
        li
            [ class className ]
            [ div
                [ class "view" ]
                [ input
                    [ class "toggle"
                    , type' "checkbox"
                    , checked model.completed
                    , onClick (Completed (not model.completed))
                    ]
                    []
                , label
                    [ onDoubleClick (Focus elementId) ]
                    [ text description ]
                , button
                    [ class "destroy"
                    , onClick Delete
                    ]
                    []
                ]
            , input
                [ class "edit"
                , value description
                , name "title"
                , id (elementId)
                , onInput Edit
                , onBlur Commit
                , onFinish Commit Cancel
                ]
                []
            ]


onFinish : msg -> msg -> Attribute msg
onFinish enterMessage escapeMessage =
    let
        select key =
            case key of
                13 ->
                    enterMessage

                _ ->
                    -- Not a 'finish' key, such as ENTER or ESCAPE
                    escapeMessage
    in
        on "keydown" (Json.Decode.map select keyCode)
