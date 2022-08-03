const baseStyleSheet = [].slice
    .call(document.styleSheets)
    .find((file) => file.href && file.href.endsWith('todomvc-common/base.css'))
export const baseCSSRules = [].slice
    .call(baseStyleSheet.cssRules)
    .map(({ cssText }) => cssText)

const appStyleSheet = [].slice
    .call(document.styleSheets)
    .find((file) => file.href && file.href.endsWith('todomvc-app-css/index.css'))
export const appCSSRules = [].slice
    .call(appStyleSheet.cssRules)
    .map(({ cssText }) => cssText)
