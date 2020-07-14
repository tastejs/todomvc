assert = require 'assert'
UnicodeTrieBuilder = require '../builder'
UnicodeTrie = require '../'

describe 'unicode trie', ->
  it 'set', ->
    trie = new UnicodeTrieBuilder 10, 666
    trie.set 0x4567, 99
    assert.equal trie.get(0x4566), 10
    assert.equal trie.get(0x4567), 99
    assert.equal trie.get(-1), 666
    assert.equal trie.get(0x110000), 666
    
  it 'set -> compacted trie', ->
    t = new UnicodeTrieBuilder 10, 666
    t.set 0x4567, 99
    
    trie = t.freeze()
    assert.equal trie.get(0x4566), 10
    assert.equal trie.get(0x4567), 99
    assert.equal trie.get(-1), 666
    assert.equal trie.get(0x110000), 666
    
  it 'setRange', ->
    trie = new UnicodeTrieBuilder 10, 666
    trie.setRange 13, 6666, 7788, false
    trie.setRange 6000, 7000, 9900, true
    
    assert.equal trie.get(12), 10
    assert.equal trie.get(13), 7788
    assert.equal trie.get(5999), 7788
    assert.equal trie.get(6000), 9900
    assert.equal trie.get(7000), 9900
    assert.equal trie.get(7001), 10
    assert.equal trie.get(0x110000), 666
    
  it 'setRange -> compacted trie', ->
    t = new UnicodeTrieBuilder 10, 666
    t.setRange 13, 6666, 7788, false
    t.setRange 6000, 7000, 9900, true
    
    trie = t.freeze()
    assert.equal trie.get(12), 10
    assert.equal trie.get(13), 7788
    assert.equal trie.get(5999), 7788
    assert.equal trie.get(6000), 9900
    assert.equal trie.get(7000), 9900
    assert.equal trie.get(7001), 10
    assert.equal trie.get(0x110000), 666
    
  it 'should work with compressed serialization format', ->
    t = new UnicodeTrieBuilder 10, 666
    t.setRange 13, 6666, 7788, false
    t.setRange 6000, 7000, 9900, true
    
    buf = t.toBuffer()
    trie = new UnicodeTrie buf
    assert.equal trie.get(12), 10
    assert.equal trie.get(13), 7788
    assert.equal trie.get(5999), 7788
    assert.equal trie.get(6000), 9900
    assert.equal trie.get(7000), 9900
    assert.equal trie.get(7001), 10
    assert.equal trie.get(0x110000), 666
    
  rangeTests = [
    {
      ranges: [
         [ 0,        0,        0,      0 ],
         [ 0,        0x40,     0,      0 ],
         [ 0x40,     0xe7,     0x1234, 0 ],
         [ 0xe7,     0x3400,   0,      0 ],
         [ 0x3400,   0x9fa6,   0x6162, 0 ],
         [ 0x9fa6,   0xda9e,   0x3132, 0 ],
         [ 0xdada,   0xeeee,   0x87ff, 0 ],
         [ 0xeeee,   0x11111,  1,      0 ],
         [ 0x11111,  0x44444,  0x6162, 0 ],
         [ 0x44444,  0x60003,  0,      0 ],
         [ 0xf0003,  0xf0004,  0xf,    0 ],
         [ 0xf0004,  0xf0006,  0x10,   0 ],
         [ 0xf0006,  0xf0007,  0x11,   0 ],
         [ 0xf0007,  0xf0040,  0x12,   0 ],
         [ 0xf0040,  0x110000, 0,      0 ]
      ]

      check: [
        [ 0,        0      ],
        [ 0x40,     0      ],
        [ 0xe7,     0x1234 ],
        [ 0x3400,   0      ],
        [ 0x9fa6,   0x6162 ],
        [ 0xda9e,   0x3132 ],
        [ 0xdada,   0      ],
        [ 0xeeee,   0x87ff ],
        [ 0x11111,  1      ],
        [ 0x44444,  0x6162 ],
        [ 0xf0003,  0      ],
        [ 0xf0004,  0xf    ],
        [ 0xf0006,  0x10   ],
        [ 0xf0007,  0x11   ],
        [ 0xf0040,  0x12   ],
        [ 0x110000, 0      ]
      ]
    },
    {
      # set some interesting overlapping ranges
      ranges: [
        [ 0,        0,        0,      0 ],
        [ 0x21,     0x7f,     0x5555, 1 ],
        [ 0x2f800,  0x2fedc,  0x7a,   1 ],
        [ 0x72,     0xdd,     3,      1 ],
        [ 0xdd,     0xde,     4,      0 ],
        [ 0x201,    0x240,    6,      1 ],  # 3 consecutive blocks with the same pattern but
        [ 0x241,    0x280,    6,      1 ],  # discontiguous value ranges, testing utrie2_enum()
        [ 0x281,    0x2c0,    6,      1 ],
        [ 0x2f987,  0x2fa98,  5,      1 ],
        [ 0x2f777,  0x2f883,  0,      1 ],
        [ 0x2f900,  0x2ffaa,  1,      0 ],
        [ 0x2ffaa,  0x2ffab,  2,      1 ],
        [ 0x2ffbb,  0x2ffc0,  7,      1 ]
      ]

      check: [
        [ 0,        0      ],
        [ 0x21,     0      ],
        [ 0x72,     0x5555 ],
        [ 0xdd,     3      ],
        [ 0xde,     4      ],
        [ 0x201,    0      ],
        [ 0x240,    6      ],
        [ 0x241,    0      ],
        [ 0x280,    6      ],
        [ 0x281,    0      ],
        [ 0x2c0,    6      ],
        [ 0x2f883,  0      ],
        [ 0x2f987,  0x7a   ],
        [ 0x2fa98,  5      ],
        [ 0x2fedc,  0x7a   ],
        [ 0x2ffaa,  1      ],
        [ 0x2ffab,  2      ],
        [ 0x2ffbb,  0      ],
        [ 0x2ffc0,  7      ],
        [ 0x110000, 0      ]
      ]
    },
    {
      # use a non-zero initial value
      ranges: [
        [ 0,        0,        9, 0 ], # non-zero initial value.
        [ 0x31,     0xa4,     1, 0 ],
        [ 0x3400,   0x6789,   2, 0 ],
        [ 0x8000,   0x89ab,   9, 1 ],
        [ 0x9000,   0xa000,   4, 1 ],
        [ 0xabcd,   0xbcde,   3, 1 ],
        [ 0x55555,  0x110000, 6, 1 ], # highStart<U+ffff with non-initialValue
        [ 0xcccc,   0x55555,  6, 1 ]
      ],
      
      check: [
        [ 0,        9 ],  # non-zero initialValue
        [ 0x31,     9 ],
        [ 0xa4,     1 ],
        [ 0x3400,   9 ],
        [ 0x6789,   2 ],
        [ 0x9000,   9 ],
        [ 0xa000,   4 ],
        [ 0xabcd,   9 ],
        [ 0xbcde,   3 ],
        [ 0xcccc,   9 ],
        [ 0x110000, 6 ]
      ]
    },
    {
      # empty or single-value tries, testing highStart==0
      ranges: [
        [ 0,        0,        3, 0 ] # Only the element with the initial value.
      ]
      
      check: [
        [ 0,        3 ],
        [ 0x110000, 3 ]
      ]
    },
    {
      ranges: [
        [ 0,        0,        3,  0 ] # Initial value = 3
        [ 0,        0x110000, 5, 1  ]
      ],
      
      check: [
        [ 0,        3 ]
        [ 0x110000, 5 ]
      ]
    }
  ]
  
  it 'should pass range tests', ->
    for test in rangeTests
      initialValue = 0
      errorValue = 0x0bad
      i = 0
      if test.ranges[i][1] < 0
        errorValue = test.ranges[i][2]
        i++
      
      initialValue = test.ranges[i++][2]
      trie = new UnicodeTrieBuilder initialValue, errorValue
      
      for range in test.ranges[i...]
        trie.setRange range[0], range[1] - 1, range[2], range[3] isnt 0
        
      frozen = trie.freeze()
      
      start = 0
      for check in test.check
        for start in [start...check[0]] by 1
          assert.equal trie.get(start), check[1]
          assert.equal frozen.get(start), check[1]
                    