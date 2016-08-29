/*!
 * proxy-addr
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module exports.
 */

module.exports = proxyaddr;
module.exports.all = alladdrs;
module.exports.compile = compile;

/**
 * Module dependencies.
 */

var forwarded = require('forwarded');
var ipaddr = require('ipaddr.js');

/**
 * Variables.
 */

var digitre = /^[0-9]+$/;
var isip = ipaddr.isValid;
var parseip = ipaddr.parse;

/**
 * Pre-defined IP ranges.
 */

var ipranges = {
  linklocal: ['169.254.0.0/16', 'fe80::/10'],
  loopback: ['127.0.0.1/8', '::1/128'],
  uniquelocal: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', 'fc00::/7']
};

/**
 * Get all addresses in the request, optionally stopping
 * at the first untrusted.
 *
 * @param {Object} request
 * @param {Function|Array|String} [trust]
 * @api public
 */

function alladdrs(req, trust) {
  // get addresses
  var addrs = forwarded(req);

  if (!trust) {
    // Return all addresses
    return addrs;
  }

  if (typeof trust !== 'function') {
    trust = compile(trust);
  }

  for (var i = 0; i < addrs.length - 1; i++) {
    if (trust(addrs[i], i)) continue;

    addrs.length = i + 1;
  }

  return addrs;
}

/**
 * Compile argument into trust function.
 *
 * @param {Array|String} val
 * @api private
 */

function compile(val) {
  if (!val) {
    throw new TypeError('argument is required');
  }

  var trust = typeof val === 'string'
    ? [val]
    : val;

  if (!Array.isArray(trust)) {
    throw new TypeError('unsupported trust argument');
  }

  for (var i = 0; i < trust.length; i++) {
    val = trust[i];

    if (!ipranges.hasOwnProperty(val)) {
      continue;
    }

    // Splice in pre-defined range
    val = ipranges[val];
    trust.splice.apply(trust, [i, 1].concat(val));
    i += val.length - 1;
  }

  return compileTrust(compileRangeSubnets(trust));
}

/**
 * Compile `arr` elements into range subnets.
 *
 * @param {Array} arr
 * @api private
 */

function compileRangeSubnets(arr) {
  var rangeSubnets = new Array(arr.length);

  for (var i = 0; i < arr.length; i++) {
    rangeSubnets[i] = parseipNotation(arr[i]);
  }

  return rangeSubnets;
}

/**
 * Compile range subnet array into trust function.
 *
 * @param {Array} rangeSubnets
 * @api private
 */

function compileTrust(rangeSubnets) {
  // Return optimized function based on length
  var len = rangeSubnets.length;
  return len === 0
    ? trustNone
    : len === 1
    ? trustSingle(rangeSubnets[0])
    : trustMulti(rangeSubnets);
}

/**
 * Parse IP notation string into range subnet.
 *
 * @param {String} note
 * @api private
 */

function parseipNotation(note) {
  var pos = note.lastIndexOf('/');
  var str = pos !== -1
    ? note.substring(0, pos)
    : note;

  if (!isip(str)) {
    throw new TypeError('invalid IP address: ' + str);
  }

  var ip = parseip(str);

  if (pos === -1 && ip.kind() === 'ipv6' && ip.isIPv4MappedAddress()) {
    // Store as IPv4
    ip = ip.toIPv4Address();
  }

  var max = ip.kind() === 'ipv6'
    ? 128
    : 32;

  var range = pos !== -1
    ? note.substring(pos + 1, note.length)
    : null;

  if (range === null) {
    range = max;
  } else if (digitre.test(range)) {
    range = parseInt(range, 10);
  } else if (ip.kind() === 'ipv4' && isip(range)) {
    range = parseNetmask(range);
  } else {
    range = null;
  }

  if (range <= 0 || range > max) {
    throw new TypeError('invalid range on address: ' + note);
  }

  return [ip, range];
}

/**
 * Parse netmask string into CIDR range.
 *
 * @param {String} netmask
 * @api private
 */

function parseNetmask(netmask) {
  var ip = parseip(netmask);
  var kind = ip.kind();

  return kind === 'ipv4'
    ? ip.prefixLengthFromSubnetMask()
    : null;
}

/**
 * Determine address of proxied request.
 *
 * @param {Object} request
 * @param {Function|Array|String} trust
 * @api public
 */

function proxyaddr(req, trust) {
  if (!req) {
    throw new TypeError('req argument is required');
  }

  if (!trust) {
    throw new TypeError('trust argument is required');
  }

  var addrs = alladdrs(req, trust);
  var addr = addrs[addrs.length - 1];

  return addr;
}

/**
 * Static trust function to trust nothing.
 *
 * @api private
 */

function trustNone() {
  return false;
}

/**
 * Compile trust function for multiple subnets.
 *
 * @param {Array} subnets
 * @api private
 */

function trustMulti(subnets) {
  return function trust(addr) {
    if (!isip(addr)) return false;

    var ip = parseip(addr);
    var ipconv;
    var kind = ip.kind();

    for (var i = 0; i < subnets.length; i++) {
      var subnet = subnets[i];
      var subnetip = subnet[0];
      var subnetkind = subnetip.kind();
      var subnetrange = subnet[1];
      var trusted = ip;

      if (kind !== subnetkind) {
        if (subnetkind === 'ipv4' && !ip.isIPv4MappedAddress()) {
          // Incompatible IP addresses
          continue;
        }

        if (!ipconv) {
          // Convert IP to match subnet IP kind
          ipconv = subnetkind === 'ipv4'
            ? ip.toIPv4Address()
            : ip.toIPv4MappedAddress();
        }

        trusted = ipconv;
      }

      if (trusted.match(subnetip, subnetrange)) {
        return true;
      }
    }

    return false;
  };
}

/**
 * Compile trust function for single subnet.
 *
 * @param {Object} subnet
 * @api private
 */

function trustSingle(subnet) {
  var subnetip = subnet[0];
  var subnetkind = subnetip.kind();
  var subnetisipv4 = subnetkind === 'ipv4';
  var subnetrange = subnet[1];

  return function trust(addr) {
    if (!isip(addr)) return false;

    var ip = parseip(addr);
    var kind = ip.kind();

    if (kind !== subnetkind) {
      if (subnetisipv4 && !ip.isIPv4MappedAddress()) {
        // Incompatible IP addresses
        return false;
      }

      // Convert IP to match subnet IP kind
      ip = subnetisipv4
        ? ip.toIPv4Address()
        : ip.toIPv4MappedAddress();
    }

    return ip.match(subnetip, subnetrange);
  };
}
