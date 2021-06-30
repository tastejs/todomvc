# FOLD Developer Interview Project - todomvc
## Sunit Mody (2021)

## Table of Contents
1. [Description](#description)
2. [Project Template Link](#link)
3. [Getting Started](#getting)
4. [Implemented Feature](#feature)
5. [Highlights](#highlights)
6. [Possible areas of improvement](#improvements)
7. [Technologies](#techs)

<a name="description"/>

## Project Description
- This project is a modification to an existing todoMVC repo created using React

<a name="link"/>

## Project Template Link
- The orignal repo that I modified:
  -  https://github.com/tastejs/todomvc/tree/gh-pages/examples/react
- Original application hosted on internet:
  - https://todomvc.com/examples/react/#/

<a name="getting"/>

## Getting Started
- Fork and clone repo to your local enviornment

- From within the root directory ~/todomvc/examples/react
```
$ npm install
```

- Start gulp server on port 8000
```
$ npm start
```

- View app locally in browser
```
http://localhost:8000/examples/react/#/
```

<a name="feature"/>

## Implemented Feature
- The feature I added was the functionality to add multiple tags to each todo item that is created. The tags are visible next to each todo item. The user is able to filter through the todos and display them by selecting one or multiple tags. The user can also remove an already selected tag (for filtering) by clicking on it again. Lastly the user can click "Clear tags filter" to completely remove all tag filters.

### Original
<img src="readme_images/original_todo.png" width="100">

### After tag feature added
<img src="readme_images/tag_feature.png" width="100">

<a name="highlights"/>

## Highlights
- Added CSS styling (including flex-box) to make tags easily visible. Also added a different color hover highlighting of tags to differentiate from active vs completed filters.

- Used array methods (higher-order functions) such as .map, .filter, and .some to modify arrays to help with state management.

- Managed filtering of todos by tags using a click-handler to modify state. This is compared to the existing filtering logic of active vs completed todos which uses the URL's endpoint and routing to modify state.

<a name="improvements"/>

## Possible areas of improvement

- Update React and JS syntax to ES6 and/or use React Hooks

- Add abiltiy to edit or remove existing tags

- Highlight selected tags so it's easy to see which tags are currently being used to filter the todos with

- Create a separate component for "tag" and maybe "tagInput" for better separation of concerns

- Clean up styling to be able to handle numerous tags without cluttering the footer component

<a name="techs"/>

## Technologies

Highlighted Technologies:
- React
- Gulp
- Javascript