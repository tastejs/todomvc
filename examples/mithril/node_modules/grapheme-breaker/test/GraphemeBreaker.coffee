expect = require('chai').expect
fs = require 'fs'
punycode = require 'punycode'
GraphemeBreaker = require '../src/GraphemeBreaker'

describe 'GraphemeBreaker', ->    
  it 'basic test', ->
    broken = GraphemeBreaker.break('Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞')
    expect(broken).to.deep.equal(['Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍', 'A̴̵̜̰͔ͫ͗͢', 'L̠ͨͧͩ͘', 'G̴̻͈͍͔̹̑͗̎̅͛́', 'Ǫ̵̹̻̝̳͂̌̌͘', '!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞'])
    
    
  it 'nextBreak', ->
    str = 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞'
    index = 0
        
    res = []
    while (brk = GraphemeBreaker.nextBreak(str, index)) < str.length
      res.push str.slice(index, brk)
      index = brk
      
    res.push str.slice(index)
    expect(res).to.deep.equal(['Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍', 'A̴̵̜̰͔ͫ͗͢', 'L̠ͨͧͩ͘', 'G̴̻͈͍͔̹̑͗̎̅͛́', 'Ǫ̵̹̻̝̳͂̌̌͘', '!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞'])
    
  it 'nextBreak intermediate indexes', ->
    str = 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞'
    breaks = {}
    
    for i in [-1...str.length] by 1
      brk = GraphemeBreaker.nextBreak(str, i)
      breaks[brk] = brk
      
    expect(Object.keys(breaks).map (b) -> breaks[b]).to.deep.equal([ 0, 19, 28, 34, 47, 58, 75 ])
    
  it 'previousBreak', ->
    str = 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞'
    index = str.length
        
    res = []
    while (brk = GraphemeBreaker.previousBreak(str, index)) > 0
      res.push str.slice(brk, index)
      index = brk
      
    res.push str.slice(0, index)
    expect(res).to.deep.equal(['Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍', 'A̴̵̜̰͔ͫ͗͢', 'L̠ͨͧͩ͘', 'G̴̻͈͍͔̹̑͗̎̅͛́', 'Ǫ̵̹̻̝̳͂̌̌͘', '!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞'].reverse())
    
  it 'previousBreak intermediate indexes', ->
    str = 'Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞'
    breaks = {}
    
    for i in [str.length+1..0] by -1
      brk = GraphemeBreaker.previousBreak(str, i)
      breaks[brk] = brk
      
    expect(Object.keys(breaks).map (b) -> breaks[b]).to.deep.equal([ 0, 19, 28, 34, 47, 58, 75 ])
    
  it 'previousBreak handles astral characters (e.g. emoji)', ->
    str = '😜🇺🇸👍'
    
    res = []
    index = str.length
    while (brk = GraphemeBreaker.previousBreak(str, index)) > 0
      res.push str.slice(brk, index)
      index = brk
      
    res.push str.slice(0, index)
    expect(res).to.deep.equal([ '👍', '🇺🇸', '😜' ])
    
  it 'nextBreak handles astral characters (e.g. emoji)', ->
    str = '😜🇺🇸👍'
    
    res = []
    index = 0
    while (brk = GraphemeBreaker.nextBreak(str, index)) < str.length
      res.push str.slice(index, brk)
      index = brk
      
    res.push str.slice(index)
    expect(res).to.deep.equal([ '😜', '🇺🇸', '👍' ])
  
  it 'should pass all tests in GraphemeBreakTest.txt', ->
    data = fs.readFileSync __dirname + '/GraphemeBreakTest.txt', 'utf8'
    lines = data.split('\n')
            
    for line in lines
      continue if not line or /^#/.test(line)
  
      [cols, comment] = line.split('#')
      codePoints = cols.split(/\s*[×÷]\s*/).filter(Boolean).map (c) -> parseInt(c, 16)
      str = punycode.ucs2.encode codePoints
      
      expected = cols.split(/\s*÷\s*/).filter(Boolean).map (c) ->
        codes = c.split(/\s*×\s*/)
        codes = codes.map (c) -> parseInt(c, 16)
        punycode.ucs2.encode codes
            
      comment = comment.trim()
      expect(GraphemeBreaker.break(str)).to.deep.equal expected, comment
      expect(GraphemeBreaker.countBreaks(str)).to.equal expected.length, comment
      
  it 'should pass all tests in GraphemeBreakTest.txt in reverse', ->
    data = fs.readFileSync __dirname + '/GraphemeBreakTest.txt', 'utf8'
    lines = data.split('\n')
            
    for line in lines
      continue if not line or /^#/.test(line)
  
      [cols, comment] = line.split('#')
      codePoints = cols.split(/\s*[×÷]\s*/).filter(Boolean).map (c) -> parseInt(c, 16)
      str = punycode.ucs2.encode codePoints
      
      expected = cols.split(/\s*÷\s*/).filter(Boolean).map (c) ->
        codes = c.split(/\s*×\s*/)
        codes = codes.map (c) -> parseInt(c, 16)
        punycode.ucs2.encode codes
        
      res = []
      index = str.length
      while (brk = GraphemeBreaker.previousBreak(str, index)) > 0
        res.push str.slice(brk, index)
        index = brk
      
      res.push str.slice(0, index)
      expect(res).to.deep.equal expected.reverse(), comment.trim()
