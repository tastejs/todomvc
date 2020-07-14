/* eslint-disable */
;(function() {
"use strict"
/* eslint-enable */
Stream.SKIP = {}
Stream.lift = lift
Stream.scan = scan
Stream.merge = merge
Stream.combine = combine
Stream.scanMerge = scanMerge
Stream["fantasy-land/of"] = Stream

var warnedHalt = false
Object.defineProperty(Stream, "HALT", {
	get: function() {
		warnedHalt || console.log("HALT is deprecated and has been renamed to SKIP");
		warnedHalt = true
		return Stream.SKIP
	}
})

function Stream(value) {
	var dependentStreams = []
	var dependentFns = []

	function stream(v) {
		if (arguments.length && v !== Stream.SKIP) {
			value = v
			if (open(stream)) {
				stream._changing()
				stream._state = "active"
				dependentStreams.forEach(function(s, i) { s(dependentFns[i](value)) })
			}
		}

		return value
	}

	stream.constructor = Stream
	stream._state = arguments.length && value !== Stream.SKIP ? "active" : "pending"
	stream._parents = []

	stream._changing = function() {
		if (open(stream)) stream._state = "changing"
		dependentStreams.forEach(function(s) {
			s._changing()
		})
	}

	stream._map = function(fn, ignoreInitial) {
		var target = ignoreInitial ? Stream() : Stream(fn(value))
		target._parents.push(stream)
		dependentStreams.push(target)
		dependentFns.push(fn)
		return target
	}

	stream.map = function(fn) {
		return stream._map(fn, stream._state !== "active")
	}

	var end
	function createEnd() {
		end = Stream()
		end.map(function(value) {
			if (value === true) {
				stream._parents.forEach(function (p) {p._unregisterChild(stream)})
				stream._state = "ended"
				stream._parents.length = dependentStreams.length = dependentFns.length = 0
			}
			return value
		})
		return end
	}

	stream.toJSON = function() { return value != null && typeof value.toJSON === "function" ? value.toJSON() : value }

	stream["fantasy-land/map"] = stream.map
	stream["fantasy-land/ap"] = function(x) { return combine(function(s1, s2) { return s1()(s2()) }, [x, stream]) }

	stream._unregisterChild = function(child) {
		var childIndex = dependentStreams.indexOf(child)
		if (childIndex !== -1) {
			dependentStreams.splice(childIndex, 1)
			dependentFns.splice(childIndex, 1)
		}
	}

	Object.defineProperty(stream, "end", {
		get: function() { return end || createEnd() }
	})

	return stream
}

function combine(fn, streams) {
	var ready = streams.every(function(s) {
		if (s.constructor !== Stream)
			throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream")
		return s._state === "active"
	})
	var stream = ready
		? Stream(fn.apply(null, streams.concat([streams])))
		: Stream()

	var changed = []

	var mappers = streams.map(function(s) {
		return s._map(function(value) {
			changed.push(s)
			if (ready || streams.every(function(s) { return s._state !== "pending" })) {
				ready = true
				stream(fn.apply(null, streams.concat([changed])))
				changed = []
			}
			return value
		}, true)
	})

	var endStream = stream.end.map(function(value) {
		if (value === true) {
			mappers.forEach(function(mapper) { mapper.end(true) })
			endStream.end(true)
		}
		return undefined
	})

	return stream
}

function merge(streams) {
	return combine(function() { return streams.map(function(s) { return s() }) }, streams)
}

function scan(fn, acc, origin) {
	var stream = origin.map(function(v) {
		var next = fn(acc, v)
		if (next !== Stream.SKIP) acc = next
		return next
	})
	stream(acc)
	return stream
}

function scanMerge(tuples, seed) {
	var streams = tuples.map(function(tuple) { return tuple[0] })

	var stream = combine(function() {
		var changed = arguments[arguments.length - 1]
		streams.forEach(function(stream, i) {
			if (changed.indexOf(stream) > -1)
				seed = tuples[i][1](seed, stream())
		})

		return seed
	}, streams)

	stream(seed)

	return stream
}

function lift() {
	var fn = arguments[0]
	var streams = Array.prototype.slice.call(arguments, 1)
	return merge(streams).map(function(streams) {
		return fn.apply(undefined, streams)
	})
}

function open(s) {
	return s._state === "pending" || s._state === "active" || s._state === "changing"
}

if (typeof module !== "undefined") module["exports"] = Stream
else if (typeof window.m === "function" && !("stream" in window.m)) window.m.stream = Stream
else window.m = {stream : Stream}

}());
