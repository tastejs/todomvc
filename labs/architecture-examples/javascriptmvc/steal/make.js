load('steal/rhino/rhino.js');

steal.File('steal/js').copyTo('js')
steal.File('js').setExecutable()
steal.File('steal/js.bat').copyTo('js.bat')
