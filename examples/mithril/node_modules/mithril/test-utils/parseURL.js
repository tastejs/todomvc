"use strict"

module.exports = function parseURL(url, root) {
	var data = {}
	var protocolIndex = url.indexOf("://")
	var pathnameIndex = protocolIndex > -1 ? url.indexOf("/", protocolIndex + 3) : url.indexOf("/")
	var searchIndex = url.indexOf("?")
	var hashIndex = url.indexOf("#")
	if ((pathnameIndex > searchIndex && searchIndex > -1) || (pathnameIndex > hashIndex && hashIndex > -1)) pathnameIndex = -1
	if (searchIndex > hashIndex && hashIndex > -1) searchIndex = -1
	var pathnameEnd = searchIndex > -1 ? searchIndex : hashIndex > -1 ? hashIndex : url.length
	if (protocolIndex > -1) {
		//it's a full URL
		if (pathnameIndex < 0) pathnameIndex = url.length
		var portIndex = url.indexOf(":", protocolIndex + 1)
		if (portIndex < 0) portIndex = pathnameIndex
		data.protocol = url.slice(0, protocolIndex + 1)
		data.hostname = url.slice(protocolIndex + 3, portIndex)
		data.port = url.slice(portIndex + 1, pathnameIndex)
		data.pathname = url.slice(pathnameIndex, pathnameEnd) || "/"
	}
	else {
		data.protocol = root.protocol
		data.hostname = root.hostname
		data.port = root.port
		if (pathnameIndex === 0) {
			//it's an absolute path
			data.pathname = url.slice(pathnameIndex, pathnameEnd) || "/"
		}
		else if (searchIndex !== 0 && hashIndex !== 0) {
			//it's a relative path
			var slashIndex = root.pathname.lastIndexOf("/")
			var path = slashIndex > -1 ? root.pathname.slice(0, slashIndex + 1) : "./"
			var normalized = url.slice(0, pathnameEnd).replace(/^\.$/, root.pathname.slice(slashIndex + 1)).replace(/^\.\//, "")
			var dotdot = /\/[^\/]+?\/\.{2}/g
			var pathname = path + normalized
			pathname = path + normalized
			while (dotdot.test(pathname)) pathname = pathname.replace(dotdot, "")
			pathname = pathname.replace(/\/\.\//g, "/").replace(/^(\/\.{2})+/, "") || "/"
			data.pathname = pathname
		}
	}
	var searchEnd = hashIndex > -1 ? hashIndex : url.length
	data.search = searchIndex > -1 ? url.slice(searchIndex, searchEnd) : ""
	data.hash = hashIndex > -1 ? url.slice(hashIndex) : ""
	return data
}
