request = require 'request'
fs = require 'fs'
UnicodeTrieBuilder = require 'unicode-trie/builder'

UNICODE_VERSION = '8.0.0'
BASE_URL = "http://www.unicode.org/Public/#{UNICODE_VERSION}/ucd"

# this loads the GraphemeBreakProperty.txt file for Unicode 8.0.0 and parses it to
# combine ranges and generate CoffeeScript
request "#{BASE_URL}/auxiliary/GraphemeBreakProperty.txt", (err, res, data) ->
  re = /^([0-9A-F]+)(?:\.\.([0-9A-F]+))?\s*;\s*([A-Za-z_]+)/gm
  nextClass = 1
  classes = 
    Other: 0
  
  trie = new UnicodeTrieBuilder classes.Other

  # collect entries in the table into ranges
  # to keep things smaller.
  while match = re.exec(data)
    start = match[1]
    end = match[2] ? start  
    type = match[3]
    unless classes[type]?
      classes[type] = nextClass++
        
    trie.setRange parseInt(start, 16), parseInt(end, 16), classes[type]

  # write the trie to a file
  fs.writeFile __dirname + '/classes.trie', trie.toBuffer()
  
  # write classes to a file
  fs.writeFile __dirname + '/classes.json', JSON.stringify classes
