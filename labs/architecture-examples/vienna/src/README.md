# opal-todos

A very simple port of [TodoMVC](http://todomvc.com) (specifically based on backbone version).

## Running

Get dependencies:

```
$ bundle install
```

Run the sprockets based server for auto-compiling:

```
$ bundle exec rackup
```

Open `http://localhost:8000/labs/architecture-examples/vienna/` in the browser.


## Running Vienna tests

Before running tests start the server:

    cd todomvc/labs/architecture-examples/vienna/src
    rackup

Run all the tests with Vienna

    mocha allTests.js --reporter spec --framework=vienna

Grep on test description (useful for debugging)

    mocha allTests.js --reporter spec --framework=vienna --grep 'te all checkbox should update st'





## Code Overview

Opal comes with sprockets support built in, so using rack we can have an
easy to boot build system to handle all opal dependencies. If you look
in `index.html.erb`, you will see a call to `javascript_include_tag`
which acts just like the rails tag helper. This will include our
`app.rb` file, and all of its dependencies. Each file will be included
in a seperate `<script>..</script>` tag to make navigating the code in a
web browser easier.
