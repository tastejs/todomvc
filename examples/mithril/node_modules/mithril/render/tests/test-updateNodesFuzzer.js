"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

// pilfered and adapted from https://github.com/domvm/domvm/blob/7aaec609e4c625b9acf9a22d035d6252a5ca654f/test/src/flat-list-keyed-fuzz.js
o.spec("updateNodes keyed list Fuzzer", function() {
	var i = 0, $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})


	void [
		{delMax: 0, movMax: 50, insMax: 9},
		{delMax: 3, movMax: 5, insMax: 5},
		{delMax: 7, movMax: 15, insMax: 0},
		{delMax: 5, movMax: 100, insMax: 3},
		{delMax: 5, movMax: 0, insMax: 3},
	].forEach(function(c) {
		var tests = 250

		while (tests--) {
			var test = fuzzTest(c.delMax, c.movMax, c.insMax)
			o(i++ + ": " + test.list.join() + " -> " + test.updated.join(), function() {
				render(root, test.list.map(function(x){return {tag: x, key: x}}))
				addSpies(root)
				render(root, test.updated.map(function(x){return {tag: x, key: x}}))

				if (root.appendChild.callCount + root.insertBefore.callCount !== test.expected.creations + test.expected.moves) console.log(test, {aC: root.appendChild.callCount, iB: root.insertBefore.callCount}, [].map.call(root.childNodes, function(n){return n.nodeName.toLowerCase()}))

				o(root.appendChild.callCount + root.insertBefore.callCount).equals(test.expected.creations + test.expected.moves)("moves")
				o(root.removeChild.callCount).equals(test.expected.deletions)("deletions")
				o([].map.call(root.childNodes, function(n){return n.nodeName.toLowerCase()})).deepEquals(test.updated)
			})
		}
	})
})

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
// impl borrowed from https://github.com/ivijs/ivi
function longestIncreasingSubsequence(a) {
	var p = a.slice()
	var result = []
	result.push(0)
	var u
	var v

	for (var i = 0, il = a.length; i < il; ++i) {
		var j = result[result.length - 1]
		if (a[j] < a[i]) {
			p[i] = j
			result.push(i)
			continue
		}

		u = 0
		v = result.length - 1

		while (u < v) {
			var c = ((u + v) / 2) | 0 // eslint-disable-line no-bitwise
			if (a[result[c]] < a[i]) {
				u = c + 1
			} else {
				v = c
			}
		}

		if (a[i] < a[result[u]]) {
			if (u > 0) {
				p[i] = result[u - 1]
			}
			result[u] = i
		}
	}

	u = result.length
	v = result[u - 1]

	while (u-- > 0) {
		result[u] = v
		v = p[v]
	}

	return result
}

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function ins(arr, qty) {
	var p = ["a","b","c","d","e","f","g","h","i"]

	while (qty-- > 0)
		arr.splice(rand(0, arr.length - 1), 0, p.shift())
}

function del(arr, qty) {
	while (qty-- > 0)
		arr.splice(rand(0, arr.length - 1), 1)
}

function mov(arr, qty) {
	while (qty-- > 0) {
		var from = rand(0, arr.length - 1)
		var to = rand(0, arr.length - 1)

		arr.splice(to, 0, arr.splice(from, 1)[0])
	}
}

function fuzzTest(delMax, movMax, insMax) {
	var list = ["k0","k1","k2","k3","k4","k5","k6","k7","k8","k9"]
	var copy = list.slice()

	var delCount = rand(0, delMax),
		movCount = rand(0, movMax),
		insCount = rand(0, insMax)

	del(copy, delCount)
	mov(copy, movCount)

	var expected = {
		creations: insCount,
		deletions: delCount,
		moves: 0
	}

	if (movCount > 0) {
		var newPos = copy.map(function(v) {
			return list.indexOf(v)
		}).filter(function(i) {
			return i != -1
		})
		var lis = longestIncreasingSubsequence(newPos)
		expected.moves = copy.length - lis.length
	}

	ins(copy, insCount)

	return {
		expected: expected,
		list: list,
		updated: copy
	}
}

function addSpies(node) {
	node.appendChild = o.spy(node.appendChild)
	node.insertBefore = o.spy(node.insertBefore)
	node.removeChild = o.spy(node.removeChild)
}
