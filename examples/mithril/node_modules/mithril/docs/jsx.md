# JSX

- [Description](#description)
- [Setup](#setup)
- [Using Babel with Webpack](#using-babel-with-webpack)
- [JSX vs hyperscript](#jsx-vs-hyperscript)
- [Converting HTML](#converting-html)

---

### Description

JSX is a syntax extension that enables you to write HTML tags interspersed with JavaScript. It's not part of any JavaScript standards and it's not required for building applications, but it may be more pleasing to use depending on you or your team's preferences.

```jsx
function MyComponent() {
	return {
		view: () =>
			m("main", [
				m("h1", "Hello world"),
			])
	}
}

// can be written as:
function MyComponent() {
	return {
		view: () => (
			<main>
				<h1>Hello world</h1>
			</main>
		)
	}
}
```

When using JSX, it's possible to interpolate JavaScript expressions within JSX tags by using curly braces:

```jsx
var greeting = "Hello"
var url = "https://google.com"
var link = <a href={url}>{greeting}!</a>
// yields <a href="https://google.com">Hello!</a>
```

Components can be used by using a convention of uppercasing the first letter of the component name:

```jsx
m.render(document.body, <MyComponent />)
// equivalent to m.render(document.body, m(MyComponent))
```

---

### Setup

The simplest way to use JSX is via a [Babel](https://babeljs.io/) plugin.

Babel requires npm, which is automatically installed when you install [Node.js](https://nodejs.org/en/). Once npm is installed, create a project folder and run this command:

```bash
npm init -y
```

If you want to use Webpack and Babel together, [skip to the section below](#using-babel-with-webpack).

To install Babel as a standalone tool, use this command:

```bash
npm install @babel/cli @babel/preset-env @babel/plugin-transform-react-jsx --save-dev
```

Create a `.babelrc` file:

```json
{
	"presets": ["@babel/preset-env"],
	"plugins": [
		["@babel/plugin-transform-react-jsx", {
			"pragma": "m",
			"pragmaFrag": "'['"
		}]
	]
}
```

To run Babel as a standalone tool, run this from the command line:

```bash
babel src --out-dir bin --source-maps
```

#### Using Babel with Webpack

If you're already using Webpack as a bundler, you can integrate Babel to Webpack by following these steps.

```bash
npm install @babel/core babel-loader @babel/preset-env @babel/plugin-transform-react-jsx --save-dev
```

Create a `.babelrc` file:

```json
{
	"presets": ["@babel/preset-env"],
	"plugins": [
		["@babel/plugin-transform-react-jsx", {
			"pragma": "m",
			"pragmaFrag": "'['"
		}]
	]
}
```

Next, create a file called `webpack.config.js`

```jsx
const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './bin'),
		filename: 'app.js',
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /\/node_modules\//,
			use: {
				loader: 'babel-loader'
			}
		}]
	}
}
```

For those familiar with Webpack already, please note that adding the Babel options to the `babel-loader` section of your `webpack.config.js` will throw an error, so you need to include them in the separate `.babelrc` file.

This configuration assumes the source code file for the application entry point is in `src/index.js`, and this will output the bundle to `bin/app.js`.

To run the bundler, setup an npm script. Open `package.json` and add this entry under `"scripts"`:

```json
{
	"name": "my-project",
	"scripts": {
		"start": "webpack -d --watch"
	}
}
```

You can now then run the bundler by running this from the command line:

```bash
npm start
```

#### Production build

To generate a minified file, open `package.json` and add a new npm script called `build`:

```json
{
	"name": "my-project",
	"scripts": {
		"start": "webpack -d --watch",
		"build": "webpack -p",
	}
}
```

You can use hooks in your production environment to run the production build script automatically. Here's an example for [Heroku](https://www.heroku.com/):

```json
{
	"name": "my-project",
	"scripts": {
		"start": "webpack -d --watch",
		"build": "webpack -p",
		"heroku-postbuild": "webpack -p"
	}
}
```

---

### JSX vs hyperscript

JSX and hyperscript are two different syntaxes you can use for specifying vnodes, and they have different tradeoffs:

- JSX is much more approachable if you're coming from an HTML/XML background and are more comfortable specifying DOM elements with that kind of syntax. It is also slightly cleaner in many cases since it uses fewer punctuation and the attributes contain less visual noise, so many people find it much easier to read. And of course, many common editors provide autocomplete support for DOM elements in the same way they do for HTML. However, it requires an extra build step to use, editor support isn't as broad as it is with normal JS, and it's considerably more verbose. It's also a bit more verbose when dealing with a lot of dynamic content because you have to use interpolations for everything.

- Hyperscript is more approachable if you come from a backend JS background that doesn't involve much HTML or XML. It's more concise with less redundancy, and it provides a CSS-like sugar for static classes, IDs, and other attributes. It also can be used with no build step at all, although [you can add one if you wish](https://github.com/MithrilJS/mopt). And it's slightly easier to work with in the face of a lot of dynamic content, because you don't need to "interpolate" anything. However, the terseness does make it harder to read for some people, especially those less experienced and coming from a front end HTML/CSS/XML background, and I'm not aware of any plugins that auto-complete parts of hyperscript selectors like IDs, classes, and attributes.

You can see the tradeoffs come into play in more complex trees. For instance, consider this hyperscript tree, adapted from a real-world project by [@isiahmeadows](https://github.com/isiahmeadows/) with some alterations for clarity and readability:

```javascript
function SummaryView() {
    let tag, posts

    function init({attrs}) {
        Model.sendView(attrs.tag != null)
        if (attrs.tag != null) {
            tag = attrs.tag.toLowerCase()
            posts = Model.getTag(tag)
        } else {
            tag = undefined
            posts = Model.posts
        }
    }

    function feed(type, href) {
        return m(".feed", [
            type,
            m("a", {href}, m("img.feed-icon[src=./feed-icon-16.gif]")),
        ])
    }

    return {
        oninit: init,
        // To ensure the tag gets properly diffed on route change.
        onbeforeupdate: init,
        view: () =>
            m(".blog-summary", [
                m("p", "My ramblings about everything"),

                m(".feeds", [
                    feed("Atom", "blog.atom.xml"),
                    feed("RSS", "blog.rss.xml"),
                ]),

                tag != null
                    ? m(TagHeader, {len: posts.length, tag})
                    : m(".summary-header", [
                        m(".summary-title", "Posts, sorted by most recent."),
                        m(TagSearch),
                    ]),

                m(".blog-list", posts.map((post) =>
                    m(m.route.Link, {
                        class: "blog-entry",
                        href: `/posts/${post.url}`,
                    }, [
                        m(".post-date", post.date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })),

                        m(".post-stub", [
                            m(".post-title", post.title),
                            m(".post-preview", post.preview, "..."),
                        ]),

                        m(TagList, {post, tag}),
                    ])
                )),
            ])
    }
}
```

Here's the exact equivalent of the above code, using JSX instead. You can see how the two syntaxes differ just in this bit, and what tradeoffs apply.

```jsx
function SummaryView() {
    let tag, posts

    function init({attrs}) {
        Model.sendView(attrs.tag != null)
        if (attrs.tag != null) {
            tag = attrs.tag.toLowerCase()
            posts = Model.getTag(tag)
        } else {
            tag = undefined
            posts = Model.posts
        }
    }

    function feed(type, href) {
        return (
            <div class="feed">
                {type}
                <a href={href}><img class="feed-icon" src="./feed-icon-16.gif" /></a>
            </div>
        )
    }

    return {
        oninit: init,
        // To ensure the tag gets properly diffed on route change.
        onbeforeupdate: init,
        view: () => (
            <div class="blog-summary">
                <p>My ramblings about everything</p>

                <div class="feeds">
                    {feed("Atom", "blog.atom.xml")}
                    {feed("RSS", "blog.rss.xml")}
                </div>

                {tag != null
                    ? <TagHeader len={posts.length} tag={tag} />
                    : (
                        <div class="summary-header">
                            <div class="summary-title">Posts, sorted by most recent</div>
                            <TagSearch />
                        </div>
                    )
                }

                <div class="blog-list">
                    {posts.map((post) => (
                        <m.route.Link class="blog-entry" href={`/posts/${post.url}`}>
                            <div class="post-date">
                                {post.date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>

                            <div class="post-stub">
                                <div class="post-title">{post.title}</div>
                                <div class="post-preview">{post.preview}...</div>
                            </div>

                            <TagList post={post} tag={tag} />
                        </m.route.Link>
                    ))}
                </div>
            </div>
        )
    }
}
```

---

### Converting HTML

In Mithril, well-formed HTML is generally valid JSX. Little more than just pasting raw HTML is required for things to just work. About the only things you'd normally have to do are change unquoted property values like `attr=value` to `attr="value"` and change void elements like `<input>` to `<input />`, this being due to JSX being based on XML and not HTML.

When using hyperscript, you often need to translate HTML to hyperscript syntax to use it. To help speed up this process along, you can use a [community-created HTML-to-Mithril-template converter](https://arthurclemens.github.io/mithril-template-converter/index.html) to do much of it for you.
