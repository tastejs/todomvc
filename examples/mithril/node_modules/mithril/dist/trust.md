# trust(html)

- [Description](#description)
- [Signature](#signature)
- [How it works](#how-it-works)
- [Security considerations](#security-considerations)
- [Scripts that do not run](#scripts-that-do-not-run)
- [Avoid trusting HTML](#avoid-trusting-html)

---

### Description

Turns an HTML or SVG string into unescaped HTML or SVG. **Do not use `m.trust` on unsanitized user input.**

Always try to use an [alternative method](#avoid-trusting-html) first, before considering using `m.trust`.

---

### Signature

`vnode = m.trust(html)`

Argument    | Type                 | Required | Description
----------- | -------------------- | -------- | ---
`html`      | `String`             | Yes      | A string containing HTML or SVG text
**returns** | `Vnode`              |          | A trusted HTML [vnode](vnodes.md) that represents the input string

[How to read signatures](signatures.md)

---

### How it works

By default, Mithril escapes all values in order to prevent a class of security problems called [XSS injections](https://en.wikipedia.org/wiki/Cross-site_scripting).

```javascript
var userContent = "<script>alert('evil')</script>"
var view = m("div", userContent)

m.render(document.body, view)

// equivalent HTML
// <div>&lt;script&gt;alert('evil')&lt;/script&gt;</div>
```

However, sometimes it is desirable to render rich text and formatting markup. To fill that need, `m.trust` creates trusted HTML [vnodes](vnodes.md) which are rendered as HTML.

```javascript
var view = m("div", [
	m.trust("<h1>Here's some <em>HTML</em></h1>")
])

m.render(document.body, view)

// equivalent HTML
// <div><h1>Here's some <em>HTML</em></h1></div>
```

Trusted HTML vnodes are objects, not strings; therefore they cannot be concatenated with regular strings.

---

### Security considerations

You **must sanitize the input** of `m.trust` to ensure there's no user-generated malicious code in the HTML string. If you don't sanitize an HTML string and mark it as a trusted string, any asynchronous JavaScript call points within the HTML string will be triggered and run with the authorization level of the user viewing the page.

There are many ways in which an HTML string may contain executable code. The most common ways to inject security attacks are to add an `onload` or `onerror` attributes in `<img>` or `<iframe>` tags, and to use unbalanced quotes such as `" onerror="alert(1)` to inject executable contexts in unsanitized string interpolations.

```javascript
var data = {}

// Sample vulnerable HTML string
var description = "<img alt='" + data.title + "'> <span>" + data.description + "</span>"

// An attack using JavaScript-related attributes
data.description = "<img onload='alert(1)'>"

// An attack using unbalanced tags
data.description = "</span><img onload='alert(1)'><span"

// An attack using unbalanced quotes
data.title = "' onerror='alert(1)"

// An attack using a different attribute
data.title = "' onmouseover='alert(1)"

// An attack that does not use JavaScript
data.description = "<a href='https://evil.com/login-page-that-steals-passwords.html'>Click here to read more</a>"
```

There are countless non-obvious ways of creating malicious code, so it is highly recommended that you use a [whitelist](https://en.wikipedia.org/wiki/Whitelist) of permitted HTML tags, attributes and attribute values, as opposed to a [blacklist](https://en.wikipedia.org/wiki/Blacklisting) to sanitize the user input. It's also highly recommended that you use a proper HTML parser, instead of regular expressions for sanitization, because regular expressions are extremely difficult to test for all edge cases.

---

### Scripts that do not run

Even though there are many obscure ways to make an HTML string run JavaScript, `<script>` tags are one thing that does not run when it appears in an HTML string.

For historical reasons, browsers ignore `<script>` tags that are inserted into the DOM via innerHTML. They do this because once the element is ready (and thus, has an accessible innerHTML property), the rendering engines cannot backtrack to the parsing-stage if the script calls something like document.write("</body>").

This browser behavior may seem surprising to a developer coming from jQuery, because jQuery implements code specifically to find script tags and run them in this scenario. Mithril follows the browser behavior. If jQuery behavior is desired, you should consider either moving the code out of the HTML string and into an `oncreate` [lifecycle method](lifecycle-methods.md), or use jQuery (or re-implement its script parsing code).

---

### Avoid trusting HTML

As a general rule of thumb, you should avoid using `m.trust` unless you are explicitly rendering rich text and there's no other way to get the results that you want.

```javascript
// AVOID
m("div", m.trust("hello world"))

// PREFER
m("div", "hello world")
```

#### Avoid blind copying and pasting

One common way to misuse `m.trust` is when working with third party services whose tutorials include HTML code to be copied and pasted. In most cases, HTML should be written using vnodes (typically via the [`m()`](hyperscript.md) utility)

Here's the example snippet for the [Facebook Like button](https://developers.facebook.com/docs/plugins/like-button):

```html
<!-- Load Facebook SDK for JavaScript -->
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<!-- Your like button code -->
<div class="fb-like"
	data-href="https://www.your-domain.com/your-page.html"
	data-layout="standard"
	data-action="like"
	data-show-faces="true">
</div>
```

And here's how to refactor into a Mithril component in a way that avoids `m.trust`:

```javascript
var FacebookLikeButton = {
	oncreate: function() {
		(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	},
	view: function() {
		return [
			m("#fb-root"),
			m("#fb-like[data-href=https://www.your-domain.com/your-page.html][data-layout=standard][data-action=like][data-show-faces=true]")
		]
	}
}
```

The Mithril component above simply copies the script tag's code into the `oncreate` hook and declares the remaining HTML tags using Mithril's `m()` syntax.

#### Avoid HTML entities

A common way to misuse `m.trust` is to use it for HTML entities. A better approach is to use the corresponding unicode characters:

```javascript
// AVOID
m("h1", "Coca-Cola", m.trust("&trade;"))

// PREFER
m("h1", "Coca-Cola™")
```

Unicode characters for accented characters can be typed using a keyboard layout for an applicable language, and one may also choose to memorize keyboard shortcuts to produce commonly used symbols (e.g. `Alt+0153` in Windows, or `Option+2` on Mac for the ™ symbol). Another simple method to produce them is to simply copy and paste the desired character from a [unicode character table](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references). Yet another related method is to type an escaped unicode codepoint (e.g. `"\u2122"` for the ™ symbol).

All characters that are representable as HTML entities have unicode counterparts, including non-visible characters such as `&nbsp;` and `&shy;`.

To avoid encoding issues, you should set the file encoding to UTF-8 on the JavaScript file, as well as add the `<meta charset="utf-8">` meta tag in the host HTML file.
