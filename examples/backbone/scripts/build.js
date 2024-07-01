const fs = require("fs").promises;
const path = require("path");

const rootDirectory = "./";
const sourceDirectory = "./src";
const targetDirectory = "./dist";

const htmlFile = "index.html";

const filesToMove = [
    "node_modules/todomvc-common/base.css",
	"node_modules/todomvc-common/base.js",
    "node_modules/todomvc-app-css/index.css",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/underscore/underscore-min.js",
    "node_modules/backbone/backbone-min.js",
    "node_modules/backbone/backbone-min.js.map",
];

const copy = async (src, dest) => {
    await fs.copyFile(src, dest);
};

const build = async () => {
    // remove dist directory if it exists
    await fs.rm(targetDirectory, { recursive: true, force: true });

    // re-create the directory.
    await fs.mkdir(targetDirectory);

    // copy src folder
    await fs.cp(sourceDirectory, targetDirectory, { recursive: true }, (err) => {
        if (err)
            console.error(err);
    });

    // copy html file
    await fs.copyFile(path.join(rootDirectory, htmlFile), path.join(targetDirectory, htmlFile));

    // copy files to move
    for (let i = 0; i < filesToMove.length; i++)
        await copy(filesToMove[i], path.join(targetDirectory, path.basename(filesToMove[i])));

    // read html file
    let html = await fs.readFile(path.join(targetDirectory, htmlFile), "utf8");

    // remove base paths from files to move
    for (let i = 0; i < filesToMove.length; i++)
        html = html.replace(filesToMove[i], path.basename(filesToMove[i]));

    // remove basePath from source directory
    const basePath = `${path.basename(sourceDirectory)}/`;
    const re = new RegExp(basePath, "g");
    html = html.replace(re, "");

    // write html files
    await fs.writeFile(`${targetDirectory}/${htmlFile}`, html);

    console.log("done!!");
};

build();
