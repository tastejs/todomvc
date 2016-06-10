module Task where

import Html (..)
import Html.Attributes (..)
import Html.Events (..)
import Json.Decode as Json
import LocalChannel as LC
import Maybe
import Signal
import String


-- MODEL

type alias Model =
    { description : String
    , completed   : Bool
    , edits       : Maybe String
    , id          : Int
    }


init : String -> Int -> Model
init desc id =
    { description = desc
    , completed = False
    , edits = Nothing
    , id = id
    }


-- UPDATE

type Action
    = Focus
    | Edit String
    | Cancel
    | Commit
    | Completed Bool
    | Delete


update : Action -> Model -> Maybe Model
update update task =
    case update of
      Focus ->
          Just { task | edits <- Just task.description }

      Edit description ->
          Just { task | edits <- Just description }

      Cancel ->
          Just { task | edits <- Nothing }

      Commit ->
          case task.edits of
            Nothing ->
                Just task

            Just rawDescription ->
                let description = String.trim rawDescription in
                if String.isEmpty description then Nothing else
                    Just
                      { task |
                          edits <- Nothing,
                          description <- description
                      }

      Completed bool ->
          Just { task | completed <- bool }

      Delete ->
          Nothing


-- VIEW

view : LC.LocalChannel (Int, Action) -> Model -> Html
view channel task =
    let className =
            (if task.completed then "completed " else "") ++
              case task.edits of
                Just _ -> "editing"
                Nothing -> ""

        description =
            Maybe.withDefault task.description task.edits
    in

    li
      [ class className ]
      [ div
          [ class "view" ]
          [ input
              [ class "toggle"
              , type' "checkbox"
              , checked task.completed
              , onClick (LC.send channel (task.id, Completed (not task.completed)))
              ]
              []
          , label
              [ onDoubleClick (LC.send channel (task.id, Focus)) ]
              [ text description ]
          , button
              [ class "destroy"
              , onClick (LC.send channel (task.id, Delete))
              ]
              []
          ]
      , input
          [ class "edit"
          , value description
          , name "title"
          , id ("todo-" ++ toString task.id)
          , on "input" targetValue (\desc -> LC.send channel (task.id, Edit desc))
          , onBlur (LC.send channel (task.id, Commit))
          , onFinish
              (LC.send channel (task.id, Commit))
              (LC.send channel (task.id, Cancel))
          ]
          []
      ]


onFinish : Signal.Message -> Signal.Message -> Attribute
onFinish enterMessage escapeMessage =
  let select key =
        case key of
          13 -> Ok enterMessage
          27 -> Ok escapeMessage
          _ -> Err "Not a 'finish' key, such as ENTER or ESCAPE"
  in
      on "keydown" (Json.customDecoder keyCode select) identity
