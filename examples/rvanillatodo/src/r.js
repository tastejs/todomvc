'use strict';
{
  const XSS = 'Possible XSS attack warning. Possible object forgery attempt detected. Codes do not match.',
    OBJ = 'Object properties don\'t work here.',
    LAST_ATTR_NAME = /\s+([\w-]+)\s*=\s*"?\s*$/,
    NEW_TAG = /<[\w]+/,
    currentKey = Math.random()+'';

  Object.assign(self,{R,render});

  function R (parts, ...vals) {
    parts = [...parts];
    const handlers = {};
    vals = vals.map(v => {
      if (Array.isArray(v) && v.every(item => !!item.handlers && !!item.str)) {
        return join(v) || '';
      } else if (typeof v === 'object' && !!v) {
        if (!!v.str && !!v.handlers) {
          return verify(v,currentKey) && v;
        }
        throw {'error': OBJ, 'value': v};
      } else return v === null || v === undefined ? '' : v;
    });
    let hid,
      hidSaved = false,
      str = '';
    while (parts.length > 1) {
      const part = parts.shift(),
        attrNameMatches = part.match(LAST_ATTR_NAME);
      let val = vals.shift();
      if (part.match(NEW_TAG)) {
        hid = `hid_${Math.random()}`;
        hidSaved = false;
      }
      if (typeof val === 'function') {
        const attrName = attrNameMatches && attrNameMatches.length > 1
            ? attrNameMatches[1].replace(/^on/,'').toLowerCase()
            : false,
          newPart = part.replace(attrNameMatches[0], '');
        str += attrName ? newPart : part;
        if (!hidSaved) {
          handlers[hid] = [];
          hidSaved = true;
          str += ` data-hid="${hid}"`;
        }
        handlers[hid].push({'eventName': attrName, 'handler': val});
      } else if (!!val && !!val.handlers && !!val.str) {
        Object.assign(handlers,val.handlers);
        str += part;
        val = val.str;
        if (attrNameMatches) val = `"${val}"`;
        str += val;
      } else {
        str += part;
        str += attrNameMatches ? `"${safe(val)}"` : safe(val);
      }
    }
    str += parts.shift();
    const o = {str,handlers};
    o.code = sign(o,currentKey);
    return o;
  }

  function render (r, root, {'replace': replace = false} = {}) {
    if (Array.isArray(r) && r.every(val => !!val.str && !!val.handlers)) r = join(r);
    verify(r,currentKey);
    const {str,handlers} = r;
    if (replace) {
      root.insertAdjacentHTML('beforeBegin', str);
      root.remove();
    } else {
      root.innerHTML = '';
      root.insertAdjacentHTML('afterBegin', str);
    }
    Object.keys(handlers).forEach(hid => {
      const node = document.querySelector(`[data-hid="${hid}"]`),
        nodeHandlers = handlers[hid];

      if (!!node && !!nodeHandlers) {
        nodeHandlers.forEach(({eventName,handler}) => node.addEventListener(eventName,handler));
      } else throw {'error': `Node or handlers could not be found for ${hid}`, hid};
    });
  }

  function join (rs) {
    const H = {},
      str = rs.map(({str,handlers,code}) => (
        verify({str,handlers,code},currentKey),Object.assign(H,handlers),str)).join('\n');

    if (str) {
      const o = {str,'handlers': H};
      o.code = sign(o,currentKey);
      return o;
    }
  }

  function safe (v) {
    return String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&/g,'&amp;').replace(/"/g,'&#34;').replace(/'/g,'&#39;');
  }

  function sign ({str,handlers},key) {
    const val = `${str}:${JSON.stringify(handlers,(k,v) => typeof v === 'function' ? `${v}` : v)}`;
    return hash(key,val);
  }

  function verify ({str,handlers,code},key) {
    if (sign({str,handlers},key) === code) return true;
    throw {'error': XSS};
  }

  function hash (key = '', str) {
    const s = str.length,
      m = bytes(key+str),
      a=new Float64Array(4);

    a[0] = 1;
    a[2] = s ? Math.pow(s+1/s, 1/2) : 3;
    a[3] = s ? Math.pow(s+1/s, 1/5) : 7;
    m.forEach((x,i) => {
      a[1] = (x+i+1)/a[3];
      a[2] += a[0]/a[1];
      a[2] = 1/a[2];
      a[3] += x;
      a[3] = a[0]/a[3];
      a[0] = a[1]+1;
    });
    a[2] *= Math.PI+a[3];
    a[3] *= Math.E+a[2];

    return new Uint8Array(a.buffer).reduce((s,b) => s+b.toString(16).padStart(2,'0'));
  }

  function symbytes (sym) {
    return unescape(encodeURIComponent(sym)).split('').map(c => c.codePointAt(0));
  }

  function bytes (str) {
    return Array.from(str).reduce((b,s) => (b.push(...symbytes(s)), b),[]);
  }
}
