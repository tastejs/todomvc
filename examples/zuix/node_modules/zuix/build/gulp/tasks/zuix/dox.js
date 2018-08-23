const gulp = require('gulp');
const dox = require('gulp-dox');
const fs = require('fs');
const srcFolder = './src/js';
const jsonApiFolder = './zuix-website/source/app/content/api/data';

module.exports = function() {
    console.log('\nGenerating JSON API files from JSDoc...');
    return Promise.all([
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/Zuix.js')
                .pipe(dox({raw: true}))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/ComponentContext.js')
                .pipe(dox({raw: true}))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/ContextController.js')
                .pipe(dox({raw: true}))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/ComponentCache.js')
                .pipe(dox({raw: true}))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/helpers/ZxQuery.js')
                .pipe(dox({raw: true}))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/localizer/Localizer.js')
                .pipe(dox({raw: true}))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        })
    ]).then(function() {
        console.log('...wrote to "'+jsonApiFolder+'".');
        // Generate ZUIX TypeScript Definition file
        console.log('\nGenerating TypeScript definitions file...');
        let tsDefs = generateTypescriptDefs('Zuix');
            tsDefs += generateTypescriptDefs('ComponentContext');
            tsDefs += generateTypescriptDefs('ContextController');
            tsDefs += generateTypescriptDefs('ComponentCache');
            tsDefs += generateTypescriptDefs('ZxQuery');
            tsDefs += '\ndeclare const zuix: Zuix;\n';
        // Write TypeScript definitions to file
        const targetFolder = 'dist/ts';
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        fs.writeFileSync(targetFolder+'/zuix.d.ts', tsDefs);
        console.log('... wrote to "'+targetFolder+'" folder.\n');
    });
};

function generateTypescriptDefs(objName) {
    const json = JSON.parse(fs.readFileSync(jsonApiFolder+'/'+objName+'.json'));
    let output = '';
    let contextOpen = false;

    const openContext = function(name) {
        if (!contextOpen) {
            output += 'interface ' + name + ' {\n';
            contextOpen = true;
        }
    };
    const closeContext = function() {
        if (contextOpen) {
            output += '}\n';
            contextOpen = false;
        }
    };

    let j;
    for (j = 0; j < json.length; j++) {
        const obj = json[j];
        const ctx = obj.ctx;
        if (ctx != null && ctx.type === 'method' && ctx.constructor === objName) {
            openContext(objName);
            output += indentTab() + ctx.name + '(';
            let t;
            for (t = 0; t < obj.tags.length; t += 1) {
                const tag = obj.tags[t];
                if (tag.type === 'param') {
                    if (tag.name[0] === '[') {
                        output += tag.name.substring(1, tag.name.length - 1) + '?: ';
                    } else {
                        output += tag.name + ': ';
                    }
                    output += getTypes(tag.types);
                    if (t < obj.tags.length - 2) {
                        output += ', ';
                    }
                } else if (tag.type === 'property') {
                    output += '): ';
                    output += getTypes(tag.types);
                    output += ';\n';
                } else if (tag.type === 'return' || tag.type === 'returns') {
                    output += '): ';
                    let returnTypes = getTypes(tag.types);
                    if (returnTypes === '') {
                        returnTypes = 'void';
                    }
                    output += returnTypes;
                    output += ';\n';
                }
            }
        } else if (ctx != null && ctx.type === 'property' && ctx.constructor === objName) {
            if (obj.tags.length > 0) {
                openContext(objName);
                let t;
                for (t = 0; t < obj.tags.length; t += 1) {
                    const tag = obj.tags[t];
                    if (tag.type === 'property') {
                        output += indentTab() + ctx.name + ': ';
                        output += getTypes(tag.types);
                        output += ';\n';
                    }
                }
            }
        } else {
            for (let key in obj) {
                const definitions = obj[key];
                if (key === 'tags' && definitions != null && definitions.length > 0) {
                    const tagType = definitions[0].type;
                    const name = definitions[0].string.replace(/\{.[^\}]+\}\s+/ig, '');
                    if (tagType === 'typedef') {
                        closeContext();
                        output += 'interface ' + name + ' {\n';
                        let i;
                        for (i = 1; i < definitions.length; i+=1) {
                            const d = definitions[i];
                            if (d.type === 'property') {
                                output += indentTab() + d.name + (d.optional ? '?' : '') + ': ';
                                output += getTypes(d.types);
                                output += ';\n';
                            }
                        }
                        output += '}\n';
                    } else if (tagType === 'callback') {
                        closeContext();
                        output += 'interface ' + name + ' {\n';
                        output += indentTab() + '(';
                        let i;
                        for (i = 1; i < definitions.length; i+=1) {
                            const d = definitions[i];
                            if (d.type === 'param') {
                                output += d.name + (d.optional ? '?' : '') + ': ';
                                output += getTypes(d.types);
                                if (i < definitions.length - 2) {
                                    output += ', ';
                                }
                            }
                        }
                        output += '): void;\n';
                        output += '}\n';
                    } else {
                        // console.log('\nWARNING: Unsupported type "' + objType + '"!\n');
                    }
                }
            }
        }
    }
    closeContext();
    return output;
}

function getTypes(types) {
    let typesString = '';
    let t;
    for (t = 0; t < types.length; t+=1) {
        let typeName = types[t];
        if (typeof typeName !== 'string') {
            typeName = JSON.stringify(typeName);
        }
        if (typeName.substring(0, 15) === 'Array.<Object.<') {
            // key/value dictionary type
            const map = typeName.substring(15, typeName.length - 2).split(',');
            typeName = '{ [k: '+map[0]+']: '+ map[1].trim() +' }';
        } else if (typeName.substring(0, 6) === 'Array.') {
            // array
            typeName = typeName.substring(7, typeName.length - 1) + '[]';
        }
        typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        typesString += typeName + (t < types.length - 1 ? ' | ' : '');
    }
    return typesString;
}

function indentTab(n) {
    return '    ';
}
