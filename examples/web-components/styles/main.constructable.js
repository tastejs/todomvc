const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host {
    display: block;
    box-shadow: none !important;
}

.main {
    position: relative;
}
`);
export default sheet;
