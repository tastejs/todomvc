!function() {
  'use strict';
  function moduleFactory() {
    function makeLevMat(xSize, ySize) {
      var i, levMat = new Array(xSize + 1);
      for (i = 0; xSize >= i; ++i) {
        levMat[i] = new Array(ySize + 1);
        levMat[i][0] = i;
      }
      for (i = 0; ySize >= i; ++i) {
        levMat[0][i] = i;
      }
      return levMat;
    }
    function areProbablyTheSame(target, source) {
      if (!source) {
        return false;
      }
      return target.nodeName === source.nodeName && (target.attributes && target.getAttribute('data-id')) === (source.attributes && source.getAttribute('data-id'));
    }
    function namedNodeMapToObject(namedNodeMap) {
      var obj = {};
      for (var i = 0, n = namedNodeMap.length; n > i; ++i) {
        var node = namedNodeMap[i];
        obj[node.name] = node.value;
      }
      return obj;
    }
    function patchElementNode(target, source) {
      var targetAttrObj = namedNodeMapToObject(target.attributes);
      var sourceAttrArr = source.attributes;
      var i, n, sourceAttr, targetAttr, attrName;
      if ('INPUT' === target.nodeName) {
        target.value = source.value || '';
      }
      if (void 0 !== source.checked) {
        target.checked = source.checked;
      }
      if (void 0 !== source.selected) {
        target.selected = source.selected;
      }
      for (i = 0, n = sourceAttrArr.length; n > i; ++i) {
        sourceAttr = sourceAttrArr[i];
        attrName = sourceAttr.name;
        targetAttr = targetAttrObj[attrName];
        delete targetAttrObj[sourceAttr.name];
        if (targetAttr && targetAttr.value === sourceAttr.value) {
          continue;
        }
        target.setAttribute(attrName, sourceAttr.value);
      }
      for (attrName in targetAttrObj) {
        target.removeAttribute(attrName);
      }
    }
    function patchTextNode(target, source) {
      var sourceValue = source.nodeValue;
      if (target.nodeValue === sourceValue) {
        return;
      }
      target.nodeValue = sourceValue;
    }
    function patchNode(target, source) {
      switch (target.nodeType) {
       case Node.ELEMENT_NODE:
        patchElementNode(target, source);
        break;

       case Node.TEXT_NODE:
        patchTextNode(target, source);
      }
    }
    function shouldIgnoreNode(node) {
      return !!node.hasAttribute && node.hasAttribute('patch-ignore');
    }
    function patchRecursive(target, source, ignoreSubtreeOf) {
      var targetParent = target.parentNode;
      var childrenToPatch = [];
      if (areProbablyTheSame(target, source)) {
        patchNode(target, source);
      } else {
        if (source) {
          targetParent.replaceChild(source, target);
        } else {
          targetParent.removeChild(target);
        }
        return;
      }
      if (ignoreSubtreeOf && -1 !== Array.prototype.indexOf.call(ignoreSubtreeOf, target)) {
        return;
      }
      var targetChildren = target.childNodes;
      var sourceChildren = source.childNodes;
      var i, n, targetPos, sourcePos, targetChild, sourceChild;
      var nTargetChildren = targetChildren.length;
      var nSourceChildren = sourceChildren.length;
      var nLeadingSameTypeChildren = 0;
      var nIgnoredTargetChildren = 0;
      var nTargetChildrenToIgnore = 0;
      var allChildrenMatchSoFar = true;
      for (i = 0; nTargetChildren > i; ++i) {
        if (shouldIgnoreNode(targetChildren[i])) {
          nTargetChildrenToIgnore++;
        } else {
          if (allChildrenMatchSoFar) {
            if (areProbablyTheSame(targetChildren[i + nTargetChildrenToIgnore], sourceChildren[i])) {
              childrenToPatch.push(targetChildren[i + nTargetChildrenToIgnore]);
              childrenToPatch.push(sourceChildren[i]);
              nLeadingSameTypeChildren++;
            } else {
              allChildrenMatchSoFar = false;
            }
          }
        }
      }
      if (nTargetChildren - nTargetChildrenToIgnore === 0 && 0 === nSourceChildren) {
        return;
      }
      var levMatSizeX = nTargetChildren - nLeadingSameTypeChildren;
      var levMatSizeY = nSourceChildren - nLeadingSameTypeChildren;
      var levMat;
      if (levMatSizeX > preallocLevMatSizeX || levMatSizeY > preallocLevMatSizeY) {
        if (levMatSizeX >= preallocLevMatSizeX && levMatSizeY >= preallocLevMatSizeY) {
          preallocLevMatSizeX = levMatSizeX;
          preallocLevMatSizeY = levMatSizeY;
          preallocLevMat = makeLevMat(preallocLevMatSizeX, preallocLevMatSizeY);
          levMat = preallocLevMat;
        } else {
          levMat = makeLevMat(levMatSizeX, levMatSizeY);
        }
      } else {
        levMat = preallocLevMat;
      }
      for (targetPos = 1; nTargetChildren - nLeadingSameTypeChildren >= targetPos + nIgnoredTargetChildren; targetPos++) {
        targetChild = targetChildren[targetPos + nIgnoredTargetChildren + nLeadingSameTypeChildren - 1];
        if (shouldIgnoreNode(targetChild)) {
          nIgnoredTargetChildren++;
          targetPos--;
          continue;
        }
        for (sourcePos = 1; nSourceChildren - nLeadingSameTypeChildren >= sourcePos; ++sourcePos) {
          if (areProbablyTheSame(targetChild, sourceChildren[sourcePos + nLeadingSameTypeChildren - 1])) {
            levMat[targetPos][sourcePos] = levMat[targetPos - 1][sourcePos - 1];
          } else {
            levMat[targetPos][sourcePos] = 1 + Math.min(levMat[targetPos - 1][sourcePos - 1], levMat[targetPos][sourcePos - 1], levMat[targetPos - 1][sourcePos]);
          }
        }
      }
      targetPos = nTargetChildren - nLeadingSameTypeChildren - nTargetChildrenToIgnore;
      sourcePos = nSourceChildren - nLeadingSameTypeChildren;
      while (targetPos > 0 || sourcePos > 0) {
        targetChild = targetChildren[targetPos + nLeadingSameTypeChildren + nTargetChildrenToIgnore - 1];
        if (targetChild && shouldIgnoreNode(targetChild)) {
          nTargetChildrenToIgnore--;
          continue;
        }
        var substitution = targetPos > 0 && sourcePos > 0 ? levMat[targetPos - 1][sourcePos - 1] : 1 / 0;
        var insertion = sourcePos > 0 ? levMat[targetPos][sourcePos - 1] : 1 / 0;
        var deletion = targetPos > 0 ? levMat[targetPos - 1][sourcePos] : 1 / 0;
        sourceChild = sourceChildren[sourcePos + nLeadingSameTypeChildren - 1];
        if (insertion >= substitution && deletion >= substitution) {
          if (substitution < levMat[targetPos][sourcePos]) {
            target.replaceChild(sourceChild, targetChild);
          } else {
            childrenToPatch.push(targetChild);
            childrenToPatch.push(sourceChild);
          }
          targetPos--;
          sourcePos--;
        } else {
          if (deletion >= insertion) {
            target.insertBefore(sourceChild, targetChild ? targetChild.nextSibling : null);
            sourcePos--;
          } else {
            target.removeChild(targetChild);
            targetPos--;
          }
        }
      }
      for (i = 0, n = childrenToPatch.length; n > i; i += 2) {
        patchRecursive(childrenToPatch[i], childrenToPatch[i + 1], ignoreSubtreeOf);
      }
    }
    function patchDom(target, source, options) {
      options = options || {};
      if (true) {
        if (!(target instanceof HTMLElement)) {
          throw '"target" argument must be an HTMLElement';
        } else {
          if (!(source instanceof HTMLElement)) {
            throw '"source" argument must be an HTMLElement';
          } else {
            if (arguments.length > 2 && 'object' != typeof options) {
              throw '"options" argument must be an object';
            } else {
              if ('ignoreSubtreeOf' in options && 'string' != typeof options.ignoreSubtreeOf) {
                throw 'ignoreSubtreeOf option must be a valid CSS selector string';
              } else {
                if (target === source) {
                  throw 'Target and source are the same, which makes no sense!';
                }
              }
            }
          }
        }
      }
      var ignoreSubtreeOf = options.ignoreSubtreeOf && target.querySelectorAll(options.ignoreSubtreeOf);
      patchRecursive(target, source, ignoreSubtreeOf);
      return target;
    }
    var preallocLevMatSizeX = 63;
    var preallocLevMatSizeY = 63;
    var preallocLevMat = makeLevMat(preallocLevMatSizeX, preallocLevMatSizeY);
    return patchDom;
  }
  if ('function' == typeof define && define.amd) {
    define(moduleFactory);
  } else {
    if ('object' == typeof exports) {
      module.exports = moduleFactory();
    } else {
      var bff = window.bff = window.bff || {};
      bff.patchDom = moduleFactory();
    }
  }
}();