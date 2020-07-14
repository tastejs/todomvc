# 3rd Party Integration

Integration with third party libraries or vanilla JavaScript code can be achieved via [lifecycle methods](lifecycle-methods.md).

## noUiSlider Example

```javascript
/** NoUiSlider wrapper component */
function Slider() {
	var slider

	return {
		oncreate: function(vnode) {
			// Initialize 3rd party lib here
			slider = noUiSlider.create(vnode.dom, {
				start: 0,
				range: {min: 0, max: 100}
			})
			slider.on('update', function(values) {
				vnode.attrs.onChange(values[0])
				m.redraw()
			})
		},
		onremove: function() {
			// Cleanup 3rd party lib on removal
			slider.destroy()
		},
		view: function() {
			return m('div')
		}
	}
}

/** Demo app component */
function Demo() {
	var showSlider = false
	var value = 0

	return {
		view: function() {
			return m('.app',
				m('p',
					m('button',
						{
							type: 'button',
							onclick: function() {
								showSlider = !showSlider
							}
						},
						showSlider ? "Destroy Slider" : "Create Slider"
					)
				),
				showSlider && m(Slider, {
					onChange: function(v) {
						value = v
					}
				}),
				m('p', value)
			)
		}
	}
}

m.mount(document.body, Demo)
```

[Live Demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4A9ACoJAAgBytAKoQAylAgATGACdpAdy0YADoe3S6WQ-RHSJYgDpowAVzTViEetNUbtACgCU0sAO0tIAbhg6cGqaWg4h0lowxE5aaEEJofTUSRiMiNLOru70vmFotJqBwemhdWJi0gCSaBDuGGoAXjDSAMxa6tKGkcQAntJqAEbShNowmXXRPjoAvNIVSt6x+DkweTBlFZr46rRYFBm1dYvEIwUADBQL1wZoAOYwBcBYEGgPF1gMAAPAoARnu91Yz2krH80KW21KAHInIZ1PskRcim4PGgyh0nPBqtDQuVKjB8HliFo4Ph6ABhQgYd4HCJQQlwZD3AC6cKu12kWHwSXUBl0AWhsIW7AW9CSWFoYU+hRcONKxP5oQa0npsGZqL6AyGI3GU2knnlio68Ji2hO8GptFGEv5Mv5YQgMF0BWxJTxGoFiWSqXSWF8SPUEDCSL51yhtXj8YckhkABEYArpEZDGYzpY0NZbA5fbjpOmFQFLqFYMRpHBCLRdFtTGswB04PNajXwgSemt7vFakkUmkq3UPV6faq-ZWaoHhyHBeHKcZMSSl0jDGvNQKw0jJk5iMR6NvA4G52fA2MTAV94fj2hT5eBdk1NQANZT4q42fry-1xtm1WaQAEIAKbW04h3S942fOo3Tg0JwKA6QAH5pDsEB0zgR1xiAzDpAKTD6VyRgvEgzC-2kWMz38J5oLrBsIOWaQADJWKXICLgvS8GSZFkvzVPEwgDRC2UJaQ1jCKjYLPWF6MvPctwucSYBo651JhBJE0HIUFRcYhfFOagnBwBh8EmSpRguctaD5NgOBATAcDwHY4AEGh6EYZgeDYbkqDUNB3wQFBOBcngKicCAEW0SgQFScgeBIYhDDgRAGhcQx3zeHYzjESLosggABUEACZ8FBfB7jESMcK0CAD0YfLaCimKtHwfg4uvbgQDgHIIEMUR2DCnqCratyPISvBktS9KxEy7LcqwZrWuKsqKqqmroupBrDxgFbCuWCautGEw8Bw0ZYAcka8B+YhCHq8gqCmpKj1mjK0CynLzDEO6HugEqNoANl+tp-qgDqPO687+sGvzWCAA)

## Bootstrap FullCalendar Example

```javascript
/** FullCalendar wrapper component */
var FullCalendar = {
	oncreate: function (vnode) {
		console.log('FullCalendar::oncreate')
		$(vnode.dom).fullCalendar({
			// put your initial options and callbacks here
		})
	},
	onremove: function (vnode) {
		// Run any destroy / cleanup methods here.
		$(vnode.dom).fullCalendar('destroy')
	},
	view: function (vnode) {
		return m('div')
	}
}

/** Demo app component */
function Demo() {
	var fullCalendarEl

	function next() {
		$(fullCalendarEl).fullCalendar('next')
	}

	function prev() {
		$(fullCalendarEl).fullCalendar('prev')
	}

	return {
		view: function (vnode) {
			return [
				m('h1', 'Calendar'),
				m(FullCalendar, {
					oncreate: function(vnode) {
						fullCalendarEl = vnode.dom
					}
				}),
				m('button', {
					onclick: prev
				}, 'Mithril Button -'),
				m('button', {
					onclick: next
				}, 'Mithril Button +')
			]
		}
	}
}

m.mount(document.body, Demo)
```

[Live Demo](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvAHigjQGsACAJxigBeADog4xAJ6w4hGDGKjuhfmBEgSxAA5xEAel3UAJmgBWcfNSi0ArobBQM-C7Sy6MJjAA9d7AEZxdMGsoKGoMWDRDR10AZnwAdnwABkDg0PCmKN58LA4LODhRAD4QAF8KdGxcRAIzShp6RmYa3QAqVu4AMTSAYQzIx24Ad14MTU0YXm46LE16JmJuVt1hNAA3Qe6Qvois7kFuYFXhYnpqfgxGRG4gtGpiCHpuAAo1tFpDGABKQ+OFYjoaDgtFg+CsAHNngByLZQHYDXiIRBnC6MKFfP4nAAkr3en3whhcX3wQW2-SyzyOaBONOI+m4mmsiwkNimHAgD3C3Fomge9Dg3AwkWm4Sgvgw1E4Atk-ExxFKGOp8oof3o-CwtDWMGut3ujzQLzeH2+vyVJ3pACVrAahRJuJ9xLxaHbdNNYELrJpuDhiIQPtLJjB8HKcUb8YSsMTSXDyY5oQ7iE6JOi-uU-msIDAhjrrXqnrjjT8qbT+MRrLwDVh4xA1imlaVVg3qWg2h0ACIwDWC8bTFxzNALJYrNC6vkGjsa55F1bcbgbKbRnaZRwAUSgxwNN1zY+4A88xCnptns5xi9jvDXUd65+he+IddnTZnW7uO80-DWh6px+4p+vu1XKArzJADeGhd8YFrRVHw3WdS3LA1v2PDMsxzV99UNPETSQn94IrbhkGfH9ZyrKFCAARihChuChJcEXRFVN2I71nlhOismonDmO5O5UW1F88zQAtPmnJjuNnM9QLXfY5ywgkXCI7im3EhVGPE0jfCZU40Coo9xJ4ywIEla4ILWRSf3KGiAFkOWUaBuAAIS0p4AFoGPM48NOcnTOI8n8znYYzdxgfc-O4SyoRs31eHspziG07gAGo6w8gBdRTlPCxsNywHIbAYZ5CWoawcAYfBfA+CRqInWhFTKCoQEwHA8HyBAqEBJpiDwMpUqodguAQFBKmampcmi6B6nLcgag0bQ9F0a1NE4cFnFcMa7KgAABcj8B2gBWXR1piqB8DqKhJAmPA4HOCBeXq4bqhADVSq6qgprwWadH0RbltWw6XAWTaACZdoATnwIH-pe062pAC7HuumK7vKB68BMABHaxJgkSbeGm9R4rm760CWlaZl0DGsd4CRNriEHyN0QwIHECnMexmH6nhq6buRhqmse6MwlA3H8c++afrJlxUhCIXl14WmEmSRnmbpQXzw586JEumpEdurrSlS0ogA)
