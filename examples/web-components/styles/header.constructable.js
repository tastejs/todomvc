const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host {
    display: block;
    box-shadow: none !important;
}

.header {
    margin-top: 27px;
}

.title {
    width: 100%;
    font-size: 80px;
    line-height: 80px;
    margin: 0;
    font-weight: 200;
    text-align: center;
    color: #b83f45;
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
}
`);
export default sheet;
