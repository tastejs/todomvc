/*
 * UnicodeNormalizer 1.0.0
 * Copyright (c) 2008 Matsuza
 * Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 * $Date: 2008-06-05 16:44:17 +0200 (Thu, 05 Jun 2008) $
 * $Rev: 13309 $
 */



(function(){
   var DEFAULT_FEATURE = [null, 0, {}];
   var CACHE_THRESHOLD = 10;
   var SBase = 0xAC00, LBase = 0x1100, VBase = 0x1161, TBase = 0x11A7, LCount = 19, VCount = 21, TCount = 28;
   var NCount = VCount * TCount; // 588
   var SCount = LCount * NCount; // 11172

   var UChar = function(cp, feature){
      this.codepoint = cp;
      this.feature = feature;
   };

   UChar.fromCharCode = function(cp, /* option */ needFeature){
      var ctx = arguments.callee;
      function fromCache(next, cp, needFeature){
         if(!ctx.cache){
            ctx.cache = {};
            ctx.counter = [];
            for(var i = 0; i <= 0xFF; ++i){
               ctx.counter[i] = 0;
            }
         }
         var ret = ctx.cache[cp];
         if(!ret){
            ret = next(cp, needFeature);
            if(!!ret.feature && ++ctx.counter[(cp >> 8) & 0xFF] > CACHE_THRESHOLD){
               ctx.cache[cp] = ret;
            }
         }
         return ret;
      }
      function fromData(next, cp, needFeature){
         var hash = cp & 0xFF00;
         var dunit = UChar.udata[hash];
         if(dunit == null){
            dunit = UChar.udata[hash] = {};
         } else if(typeof(dunit) == "string"){
            dunit = UChar.udata[hash] = eval("(" + dunit + ")");
         }
         var f = dunit[cp];
         return f ? new UChar(cp, f) : new UChar(cp, DEFAULT_FEATURE);
      }
      function fromCpOnly(next, cp, needFeature){
         return !!needFeature ? next(cp, needFeature) : new UChar(cp, null);
      }
      function fromRuleBasedJamo(next, cp, needFeature){
         if(cp < LBase || (LBase + LCount <= cp && cp < SBase) || (SBase + SCount < cp)){
            return next(cp, needFeature); 
         }
         if(LBase <= cp && cp < LBase + LCount){
            var c = {};
            var base = (cp - LBase) * VCount;
            for(var i = 0; i < VCount; ++i){
               c[VBase + i] = SBase + TCount * (i + base);
            }
            return new UChar(cp, [,,c]);
         }

         var SIndex = cp - SBase;
         var TIndex = SIndex % TCount;
         var feature = [];
         if(TIndex != 0){
            feature[0] = [SBase + SIndex - TIndex, TBase + TIndex];
         } else {
            feature[0] = [LBase + Math.floor(SIndex / NCount), VBase + Math.floor((SIndex % NCount) / TCount)];
            feature[2] = {};
            for(var i = 1; i < TCount; ++i){
               feature[2][TBase + i] = cp + i;
            }
         }
         return new UChar(cp, feature);
      }
      function fromCpFilter(next, cp, needFeature){
         return cp < 60 || 13311 < cp && cp < 42607 ? new UChar(cp, DEFAULT_FEATURE) : next(cp, needFeature);
      }
      if(!ctx.strategy){
         //first call
         var strategies = [fromCpFilter, fromCache, fromCpOnly, fromRuleBasedJamo, fromData];
         UChar.fromCharCode.strategy = null;
         while(strategies.length > 0){
            ctx.strategy = (function(next, strategy, cp, needFeature){
                  return function(cp, needFeature){
                  return strategy(next, cp, needFeature);
                  };
                  })(ctx.strategy, strategies.pop(), cp, needFeature);
         }
      }
      return ctx.strategy(cp, needFeature);
   };

   UChar.isHighSurrogate = function(cp){
      return cp >= 0xD800 && cp <= 0xDBFF;
   }
   UChar.isLowSurrogate = function(cp){
      return cp >= 0xDC00 && cp <= 0xDFFF;
   }

   UChar.prototype.prepFeature = function(){
      if(!this.feature){
         this.feature = UChar.fromCharCode(this.codepoint, true).feature;
      }
   };

   UChar.prototype.toString = function(){
      if(this.codepoint < 0x10000){
         return String.fromCharCode(this.codepoint);
      } else {
         var x = this.codepoint - 0x10000;
         return String.fromCharCode(Math.floor(x / 0x400) + 0xD800, x % 0x400 + 0xDC00);
      }
   };

   UChar.prototype.getDecomp = function(){
      this.prepFeature();
      return this.feature[0] || null;
   };

   UChar.prototype.isCompatibility = function(){
      this.prepFeature();
      return !!this.feature[1] && (this.feature[1] & (1 << 8));
   }
   UChar.prototype.isExclude = function(){
      this.prepFeature();
      return !!this.feature[1] && (this.feature[1] & (1 << 9));
   }
   UChar.prototype.getCanonicalClass = function(){
      this.prepFeature();
      return !!this.feature[1] ? (this.feature[1] & 0xff) : 0;
   }
   UChar.prototype.getComposite = function(following){
      this.prepFeature();
      if(!this.feature[2]){
         return null;
      }
      var cp = this.feature[2][following.codepoint];
      return (cp != null) ? UChar.fromCharCode(cp) : null;
   }

   var UCharIterator = function(str){
      this.str = str;
      this.cursor = 0;
   }
   UCharIterator.prototype.next = function(){
      if(!!this.str && this.cursor < this.str.length){
         var cp = this.str.charCodeAt(this.cursor++);
         var d;
         if(UChar.isHighSurrogate(cp) && this.cursor < this.str.length && UChar.isLowSurrogate((d = this.str.charCodeAt(this.cursor)))){
            cp = (cp - 0xD800) * 0x400 + (d -0xDC00) + 0x10000;
            ++this.cursor;
         }
         return UChar.fromCharCode(cp);
      } else {
         this.str = null;
         return null;
      }
   }

   var RecursDecompIterator = function(it, cano){
      this.it = it;
      this.canonical = cano;
      this.resBuf = [];
   };

   RecursDecompIterator.prototype.next = function(){
      function recursiveDecomp(cano, uchar){
         var decomp = uchar.getDecomp();
         if(!!decomp && !(cano && uchar.isCompatibility())){
            var ret = [];
            for(var i = 0; i < decomp.length; ++i){
               var a = recursiveDecomp(cano, UChar.fromCharCode(decomp[i]));
               //ret.concat(a); //<-why does not this work?
               //following block is a workaround.
               for(var j = 0; j < a.length; ++j){
                  ret.push(a[j]);
               }
            }
            return ret;
         } else {
            return [uchar];
         }
      }
      if(this.resBuf.length == 0){
         var uchar = this.it.next();
         if(!uchar){
            return null;
         }
         this.resBuf = recursiveDecomp(this.canonical, uchar); 
      }
      return this.resBuf.shift();
   };

   var DecompIterator = function(it){
      this.it = it;
      this.resBuf = [];
   };

   DecompIterator.prototype.next = function(){
      var cc;
      if(this.resBuf.length == 0){
         do{
            var uchar = this.it.next();
            if(!uchar){
               break;
            }
            cc = uchar.getCanonicalClass();
            var inspt = this.resBuf.length;
            if(cc != 0){
               for(; inspt > 0; --inspt){
                  var uchar2 = this.resBuf[inspt - 1];
                  var cc2 = uchar2.getCanonicalClass();
                  if(cc2 <= cc){
                     break;
                  }
               }
            }
            this.resBuf.splice(inspt, 0, uchar);
         } while(cc != 0);
      }
      return this.resBuf.shift();
   };

   var CompIterator = function(it){
      this.it = it;
      this.procBuf = [];
      this.resBuf = [];
      this.lastClass = null;
   };

   CompIterator.prototype.next = function(){
      while(this.resBuf.length == 0){
         var uchar = this.it.next();
         if(!uchar){
            this.resBuf = this.procBuf;
            this.procBuf = [];
            break;
         }
         if(this.procBuf.length == 0){
            this.lastClass = uchar.getCanonicalClass();
            this.procBuf.push(uchar);
         } else {
            var starter = this.procBuf[0];
            var composite = starter.getComposite(uchar);
            var cc = uchar.getCanonicalClass();
            if(!!composite && (this.lastClass < cc || this.lastClass == 0)){
               this.procBuf[0] = composite;
            } else {
               if(cc == 0){
                  this.resBuf = this.procBuf;
                  this.procBuf = [];
               }
               this.lastClass = cc;
               this.procBuf.push(uchar);
            }
         }
      }
      return this.resBuf.shift();
   };

   var createIterator = function(mode, str){
      switch(mode){
         case "NFD":
            return new DecompIterator(new RecursDecompIterator(new UCharIterator(str), true)); 
         case "NFKD":
            return new DecompIterator(new RecursDecompIterator(new UCharIterator(str), false)); 
         case "NFC":
            return new CompIterator(new DecompIterator(new RecursDecompIterator(new UCharIterator(str), true))); 
         case "NFKC":
            return new CompIterator(new DecompIterator(new RecursDecompIterator(new UCharIterator(str), false))); 
      }
      throw mode + " is invalid";
   };
   var normalize = function(mode, str){
      var it = createIterator(mode, str);
      var ret = "";
      var uchar;
      while(!!(uchar = it.next())){
         ret += uchar.toString();
      }
      return ret;
   };

   var nfd = function(str){
      return normalize("NFD", str);
   };

   var nfkd = function(str){
      return normalize("NFKD", str);
   };

   var nfc = function(str){
      return normalize("NFC", str);
   };

   var nfkc = function(str){
      return normalize("NFKC", str);
   };

   // exports
   this.UNorm = this.UNorm || {};
   var ns = this.UNorm;
   ns.UChar = UChar;
   ns.normalize = normalize;
   ns.createIterator = createIterator;
   ns.nfd = nfd;
   ns.nfkd = nfkd;
   ns.nfc = nfc;
   ns.nfkc = nfkc;
})();


