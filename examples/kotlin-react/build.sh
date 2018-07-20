
CURR_DIR=$(dirname "$(readlink -f "$0")")
npm run build; cp -av $CURR_DIR/build/* .; cp -a $CURR_DIR/index.html.ori $CURR_DIR/index.html
