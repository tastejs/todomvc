export function baseCoreMixins() {
  return {
    createpropsMap: function() {
      let wm = new WeakMap();
      let objKey = { vsid: this.props.vsid };
      wm.set(objKey, this.props);
      return {
        key: objKey,
        weakMap: wm
      };
    },
    gc: function() {
      for (let m in this) {
        delete this[m];
      }
      delete this;
    },
    createId: function() {
      //let num = Math.floor(Math.random(10000000) * 10000000);
      const num = () => Math.random().toString(36).substring(2, 8);;
      return num();
      //return `vsid-${num()}`;
    },
    setTraceFunc: function(debug) {
      return debug === true ? console.log : () => {
      };
    }
  };
}
