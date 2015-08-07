// Syntax:  cscript searchReplace.js searchRegex replaceText file1 file2 file3 ...
// Example: cscript searchReplace.js Thursday Friday weatherReport.txt

function readText(filename) {
    var fso = WSH.CreateObject("Scripting.FileSystemObject");
    var file = fso.OpenTextFile(filename, 1 /* readonly */);
    var txt = file.ReadAll();
    file.Close();
    return txt;
}

function writeText(filename, text) {
    var fso = WSH.CreateObject("Scripting.FileSystemObject");
    var file = fso.OpenTextFile(filename, 2 /* readwrite */, true);
    file.Write(text);
    file.Close();
}

var find = WScript.Arguments.Item(0),
    replace = WScript.Arguments.Item(1);

// Special handling for newline chars, as I haven't found a reasonable way to pass them from DOS
if (replace === "\\n")
    replace = "\n";

for (var i = 2; i < WScript.Arguments.Length; i++) {
    var filename = WScript.Arguments.Item(i);
    WSH.Echo("Replacing content in " + filename + "...");
    var original = readText(filename);
    var updated = original.replace(new RegExp(find, "g"), replace);
    writeText(filename, updated);
}
