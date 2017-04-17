export function trim(text) {
    return (text.match(/^\s*(.+?)\s*$/) || [""]).pop();
}
