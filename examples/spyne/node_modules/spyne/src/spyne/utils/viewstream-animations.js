let createFaderInlineText = (isInBool = false, t = 1, e = 'ease', startZeroBool = false) => {
  let initOpacityZero = startZeroBool === true ? 'opacity:0;' : '';
  let opacity = isInBool === true ? 1 : 0;
  return `${initOpacityZero}transition: opacity ${t}s ${e}; opacity: ${opacity};`;
};
export function fadein(el, t) {
  let currentOpacity = window.getComputedStyle(el).opacity * 1;
  let startAtZero = currentOpacity === 1;
  let inlineCss = createFaderInlineText(true, t, 'ease', startAtZero);
  el.style.cssText += inlineCss;
}
export function fadeout(el, t, callback) {
  let inlineCss = createFaderInlineText(false, t, 'ease');
  el.style.cssText += inlineCss;

  // window.setTimeout(callback, t * 1000);
  el.addEventListener('transitionend', callback, false);
}
