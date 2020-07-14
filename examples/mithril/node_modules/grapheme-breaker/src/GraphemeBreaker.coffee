{CR,LF,Control,Extend,Regional_Indicator,SpacingMark,L,V,T,LV,LVT} = require './classes.json'
UnicodeTrie = require 'unicode-trie'
fs = require 'fs'
classTrie = new UnicodeTrie fs.readFileSync __dirname + '/classes.trie'

# Gets a code point from a UTF-16 string
# handling surrogate pairs appropriately
codePointAt = (str, idx) ->
  idx = idx or 0
  code = str.charCodeAt(idx)

  # High surrogate
  if 0xD800 <= code <= 0xDBFF
    hi = code
    low = str.charCodeAt(idx + 1)    
    if 0xDC00 <= low <= 0xDFFF
      return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
      
    return hi
  
  # Low surrogate
  if 0xDC00 <= code <= 0xDFFF
    hi = str.charCodeAt(idx - 1)
    low = code
    if 0xD800 <= hi <= 0xDBFF
      return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
      
    return low
    
  return code
  
# Returns whether a break is allowed between the 
# two given grapheme breaking classes
shouldBreak = (previous, current) ->  
  # GB3. CR X LF
  if previous is CR and current is LF
    return false
    
  # GB4. (Control|CR|LF) ÷
  else if previous in [Control, CR, LF]
    return true
    
  # GB5. ÷ (Control|CR|LF)
  else if current in [Control, CR, LF]
    return true
    
  # GB6. L X (L|V|LV|LVT)
  else if previous is L and current in [L, V, LV, LVT]
    return false
    
  # GB7. (LV|V) X (V|T)
  else if previous in [LV, V] and current in [V, T]
    return false
    
  # GB8. (LVT|T) X (T)
  else if previous in [LVT, T] and current is T
    return false
    
  # GB8a. Regional_Indicator X Regional_Indicator
  else if previous is Regional_Indicator and current is Regional_Indicator
    return false
    
  # GB9. X Extend
  else if current is Extend
    return false
    
  # GB9a. X SpacingMark
  else if current is SpacingMark
    return false
    
  # GB9b. Prepend X (there are currently no characters with this class)
  # else if previous is Prepend
  #   return false
    
  # GB10. Any ÷ Any
  return true

# Returns the next grapheme break in the string after the given index
exports.nextBreak = (string, index = 0) ->
  if index < 0
    return 0
    
  if index >= string.length - 1
    return string.length
    
  prev = classTrie.get codePointAt(string, index)
  for i in [index + 1...string.length] by 1
    # check for already processed low surrogates
    continue if 0xd800 <= string.charCodeAt(i - 1) <= 0xdbff and 
                0xdc00 <= string.charCodeAt(i)     <= 0xdfff
    
    next = classTrie.get codePointAt(string, i)
    if shouldBreak prev, next
      return i
      
    prev = next
      
  return string.length
  
# Returns the next grapheme break in the string before the given index
exports.previousBreak = (string, index = string.length) ->
  if index > string.length
    return string.length
  
  if index <= 1
    return 0
  
  index--
  next = classTrie.get codePointAt(string, index)
  for i in [index - 1..0] by -1
    # check for already processed high surrogates
    continue if 0xd800 <= string.charCodeAt(i)     <= 0xdbff and 
                0xdc00 <= string.charCodeAt(i + 1) <= 0xdfff
    
    prev = classTrie.get codePointAt(string, i)
    if shouldBreak prev, next
      return i + 1
      
    next = prev
      
  return 0
  
# Breaks the given string into an array of grapheme cluster strings
exports.break = (str) ->
  res = []
  index = 0
  
  while (brk = exports.nextBreak(str, index)) < str.length
    res.push str.slice(index, brk)
    index = brk
    
  if index < str.length
    res.push str.slice(index)
    
  return res

# Returns the number of grapheme clusters there are in the given string
exports.countBreaks = (str) ->
  count = 0
  index = 0
  
  while (brk = exports.nextBreak(str, index)) < str.length
    index = brk
    count++
    
  if index < str.length
    count++
      
  return count
