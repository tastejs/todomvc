----------------------------------------------------------------------------
{-# LANGUAGE CPP                #-}
{-# LANGUAGE LambdaCase         #-}
{-# LANGUAGE DeriveGeneric      #-}
{-# LANGUAGE RecordWildCards    #-}
{-# LANGUAGE DeriveAnyClass     #-}
{-# LANGUAGE OverloadedStrings  #-}
{-# LANGUAGE DerivingStrategies #-}
-----------------------------------------------------------------------------
-- |
-- Module      :  Miso
-- Copyright   :  (C) 2016-2025 David M. Johnson (@dmjio)
-- License     :  BSD3-style (see the file LICENSE)
-- Maintainer  :  David M. Johnson <code@dmj.io>
-- Stability   :  experimental
-- Portability :  non-portable
----------------------------------------------------------------------------
module Main where
----------------------------------------------------------------------------
import           Control.Monad.State
import           Data.Aeson hiding (Object)
import           Data.Bool
import           GHC.Generics
----------------------------------------------------------------------------
import           Miso
import           Miso.Html
import           Miso.Html.Property hiding (label_)
import qualified Miso.String as S
import qualified Miso.CSS as CSS
----------------------------------------------------------------------------
default (MisoString)
----------------------------------------------------------------------------
#ifdef WASM
foreign export javascript "hs_start" main :: IO ()
#endif
----------------------------------------------------------------------------
data Model
  = Model
  { entries :: [Entry]
  , field :: MisoString
  , uid :: Int
  , visibility :: MisoString
  , step :: Bool
  } deriving stock (Show, Generic, Eq)
    deriving anyclass (FromJSON, ToJSON)
----------------------------------------------------------------------------
data Entry
  = Entry
  { description :: MisoString
  , completed :: Bool
  , editing :: Bool
  , eid :: Int
  , focussed :: Bool
  } deriving stock (Show, Generic, Eq)
    deriving anyclass (FromJSON, ToJSON)
----------------------------------------------------------------------------
emptyModel :: Model
emptyModel
  = Model
  { entries = []
  , visibility = "All"
  , field = mempty
  , uid = 0
  , step = False
  }
----------------------------------------------------------------------------
newEntry :: MisoString -> Int -> Entry
newEntry desc eid
  = Entry
  { description = desc
  , completed = False
  , editing = False
  , eid = eid
  , focussed = False
  }
----------------------------------------------------------------------------
data Msg
  = NoOp
  | CurrentTime Int
  | UpdateField MisoString
  | EditingEntry Int Bool
  | UpdateEntry Int MisoString
  | Add
  | Delete Int
  | DeleteComplete
  | Check Int Bool
  | CheckAll Bool
  | ChangeVisibility MisoString
  | FocusOnInput
  deriving (Show)
----------------------------------------------------------------------------
main :: IO ()
main = run (startApp app)
----------------------------------------------------------------------------
app :: App Model Msg
app = (component emptyModel updateModel viewModel)
  { events = defaultEvents <> keyboardEvents
  , initialAction = Just FocusOnInput
#ifdef VANILLA
  -- dmj: when using vanilla GHC append the styles to <head> in dev mode
  , styles =
      [ Href "https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.min.css"
      , Href "https://cdn.jsdelivr.net/npm/todomvc-app-css@2.4.3/index.min.css"
      ]
#endif
  }
----------------------------------------------------------------------------
updateModel :: Msg -> Transition Model Msg
updateModel = \case
  NoOp ->
    pure ()
  FocusOnInput ->
    io_ (focus "input-box")
  CurrentTime time ->
    io_ $ consoleLog $ S.ms (show time)
  Add -> do
    model@Model{..} <- get
    put model
      { uid = uid + 1
      , field = mempty
      , entries = entries <> [newEntry field uid | not $ S.null field]
      }
  UpdateField str ->
    modify update
      where
        update m = m { field = str }
  EditingEntry id' isEditing ->
    modify $ \m ->
      m { entries =
            filterMap (entries m) (\t -> eid t == id') $ \t ->
              t { editing = isEditing
                , focussed = isEditing
                }
        }
  UpdateEntry id' task ->
    modify $ \m -> m
      { entries = filterMap (entries m) ((== id') . eid) $ \t ->
          t { description = task }
      }
  Delete id' -> 
    modify $ \m -> m
     { entries = filter (\t -> eid t /= id') (entries m)
     }
  DeleteComplete ->
    modify $ \m -> m
      { entries = filter (not . completed) (entries m)
      }
  Check id' isCompleted ->
    modify $ \m -> m
      { entries =
          filterMap (entries m) (\t -> eid t == id') $ \t ->
            t { completed = isCompleted }
      }
  CheckAll isCompleted ->
    modify $ \m -> m
      { entries =
          filterMap (entries m) (const True) $ \t ->
            t { completed = isCompleted }
      }
  ChangeVisibility v ->
    modify $ \m -> m { visibility = v }
----------------------------------------------------------------------------
filterMap :: [a] -> (a -> Bool) -> (a -> a) -> [a]
filterMap xs predicate f = [ if predicate x then f x else x | x <- xs ]
----------------------------------------------------------------------------
viewModel :: Model -> View model Msg
viewModel m@Model{..} =
    div_
        [ class_ "todomvc-wrapper"
        ]
        [ section_
            [class_ "todoapp"]
            [ viewInput m field
            , viewEntries visibility entries
            , viewControls m visibility entries
            ]
        , infoFooter
        ]
----------------------------------------------------------------------------
viewEntries :: MisoString -> [Entry] -> View model Msg
viewEntries visibility entries =
    section_
        [ class_ "main"
        , CSS.style_ [ CSS.visibility cssVisibility ]
        ]
        [ input_
            [ class_ "toggle-all"
            , type_ "checkbox"
            , name_ "toggle"
            , id_ "toggle-all"
            , checked_ allCompleted
            , onClick $ CheckAll (not allCompleted)
            ]
        , label_
            [for_ "toggle-all"]
            [text $ S.pack "Mark all as complete"]
        , ul_ [class_ "todo-list"] $
            flip map (filter isVisible entries) $ \t ->
                viewKeyedEntry t
        ]
  where
    cssVisibility = bool "visible" "hidden" (null entries)
    allCompleted = all completed entries
    isVisible Entry{..} =
        case visibility of
            "Completed" -> completed
            "Active" -> not completed
            _ -> True
----------------------------------------------------------------------------
viewKeyedEntry :: Entry -> View model Msg
viewKeyedEntry = viewEntry
----------------------------------------------------------------------------
viewEntry :: Entry -> View model Msg
viewEntry Entry{..} =
    li_
        [ class_ $
            S.intercalate " " $
                ["completed" | completed] <> ["editing" | editing]
        , key_ eid
        ]
        [ div_
            [class_ "view"]
            [ input_
                [ class_ "toggle"
                , type_ "checkbox"
                , checked_ completed
                , onClick $ Check eid (not completed)
                ]
            , label_
                [onDoubleClick (EditingEntry eid True) ]
                [text description]
            , button_
                [ class_ "destroy"
                , onClick $ Delete eid
                ]
                []
            ]
        , input_
            [ class_ "edit"
            , value_ description
            , name_ "title"
            , id_ ("todo-" <> S.ms eid)
            , onInput (UpdateEntry eid)
            , onBlur (EditingEntry eid False)
            , onEnter NoOp (EditingEntry eid False)
            ]
        ]
----------------------------------------------------------------------------
viewControls :: Model -> MisoString -> [Entry] -> View model Msg
viewControls model visibility entries =
    footer_
        [ class_ "footer"
        , hidden_ (null entries)
        ]
        [ viewControlsCount entriesLeft
        , viewControlsFilters visibility
        , viewControlsClear model entriesCompleted
        ]
  where
    entriesCompleted = length . filter completed $ entries
    entriesLeft = length entries - entriesCompleted
----------------------------------------------------------------------------
viewControlsCount :: Int -> View model Msg
viewControlsCount entriesLeft =
    span_
        [class_ "todo-count"]
        [ strong_ [] [text $ S.ms entriesLeft]
        , text (item_ <> " left")
        ]
  where
    item_ = S.pack $ bool " items" " item" (entriesLeft == 1)
----------------------------------------------------------------------------
viewControlsFilters :: MisoString -> View model Msg
viewControlsFilters visibility =
    ul_
        [class_ "filters"]
        [ visibilitySwap "#/" "All" visibility
        , text " "
        , visibilitySwap "#/active" "Active" visibility
        , text " "
        , visibilitySwap "#/completed" "Completed" visibility
        ]
----------------------------------------------------------------------------
visibilitySwap :: MisoString -> MisoString -> MisoString -> View model Msg
visibilitySwap uri visibility actualVisibility =
    li_
        []
        [ a_
            [ href_ uri
            , class_ $ S.concat ["selected" | visibility == actualVisibility]
            , onClick (ChangeVisibility visibility)
            ]
            [text visibility]
        ]
----------------------------------------------------------------------------
viewControlsClear :: Model -> Int -> View model Msg
viewControlsClear _ entriesCompleted =
    button_
        [ class_ "clear-completed"
        , prop "hidden" (entriesCompleted == 0)
        , onClick DeleteComplete
        ]
        [text $ "Clear completed (" <> S.ms entriesCompleted <> ")"]
----------------------------------------------------------------------------
viewInput :: Model -> MisoString -> View model Msg
viewInput _ task =
    header_
        [class_ "header"]
        [ h1_ [] [text "todos"]
        , input_
            [ class_ "new-todo"
            , id_ "input-box"
            , placeholder_ "What needs to be done?"
            , autofocus_ True
            , value_ task
            , name_ "newTodo"
            , onInput UpdateField
            , onEnter NoOp Add
            ]
        ]
----------------------------------------------------------------------------
infoFooter :: View model Msg
infoFooter =
    footer_
        [class_ "info"]
        [ p_ [] [text "Double-click to edit a todo"]
        , p_
            []
            [ text "Written by "
            , a_ [href_ "https://github.com/dmjio"] [text "@dmjio"]
            ]
        , p_
            []
            [ text "Part of "
            , a_ [href_ "http://todomvc.com"] [text "TodoMVC"]
            ]
        ]
----------------------------------------------------------------------------
