UnicodeTrie = require './'
pako = require 'pako'

class UnicodeTrieBuilder
  # Shift size for getting the index-1 table offset.
  SHIFT_1 = 6 + 5

  # Shift size for getting the index-2 table offset.
  SHIFT_2 = 5

  # Difference between the two shift sizes,
  # for getting an index-1 offset from an index-2 offset. 6=11-5
  SHIFT_1_2 = SHIFT_1 - SHIFT_2

  # Number of index-1 entries for the BMP. 32=0x20
  # This part of the index-1 table is omitted from the serialized form.
  OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> SHIFT_1

  # Number of code points per index-1 table entry. 2048=0x800
  CP_PER_INDEX_1_ENTRY = 1 << SHIFT_1

  # Number of entries in an index-2 block. 64=0x40
  INDEX_2_BLOCK_LENGTH = 1 << SHIFT_1_2

  # Mask for getting the lower bits for the in-index-2-block offset. */
  INDEX_2_MASK = INDEX_2_BLOCK_LENGTH - 1

  # Number of entries in a data block. 32=0x20
  DATA_BLOCK_LENGTH = 1 << SHIFT_2

  # Mask for getting the lower bits for the in-data-block offset.
  DATA_MASK = DATA_BLOCK_LENGTH - 1

  # Shift size for shifting left the index array values.
  # Increases possible data size with 16-bit index values at the cost
  # of compactability.
  # This requires data blocks to be aligned by DATA_GRANULARITY.
  INDEX_SHIFT = 2

  # The alignment size of a data block. Also the granularity for compaction.
  DATA_GRANULARITY = 1 << INDEX_SHIFT

  # The BMP part of the index-2 table is fixed and linear and starts at offset 0.
  # Length=2048=0x800=0x10000>>SHIFT_2.
  INDEX_2_OFFSET = 0

  # The part of the index-2 table for U+D800..U+DBFF stores values for
  # lead surrogate code _units_ not code _points_.
  # Values for lead surrogate code _points_ are indexed with this portion of the table.
  # Length=32=0x20=0x400>>SHIFT_2. (There are 1024=0x400 lead surrogates.)
  LSCP_INDEX_2_OFFSET = 0x10000 >> SHIFT_2
  LSCP_INDEX_2_LENGTH = 0x400 >> SHIFT_2

  # Count the lengths of both BMP pieces. 2080=0x820
  INDEX_2_BMP_LENGTH = LSCP_INDEX_2_OFFSET + LSCP_INDEX_2_LENGTH

  # The 2-byte UTF-8 version of the index-2 table follows at offset 2080=0x820.
  # Length 32=0x20 for lead bytes C0..DF, regardless of SHIFT_2.
  UTF8_2B_INDEX_2_OFFSET = INDEX_2_BMP_LENGTH
  UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6  # U+0800 is the first code point after 2-byte UTF-8

  # The index-1 table, only used for supplementary code points, at offset 2112=0x840.
  # Variable length, for code points up to highStart, where the last single-value range starts.
  # Maximum length 512=0x200=0x100000>>SHIFT_1.
  # (For 0x100000 supplementary code points U+10000..U+10ffff.)
  #
  # The part of the index-2 table for supplementary code points starts
  # after this index-1 table.
  #
  # Both the index-1 table and the following part of the index-2 table
  # are omitted completely if there is only BMP data.
  INDEX_1_OFFSET = UTF8_2B_INDEX_2_OFFSET + UTF8_2B_INDEX_2_LENGTH
  MAX_INDEX_1_LENGTH = 0x100000 >> SHIFT_1

  # The illegal-UTF-8 data block follows the ASCII block, at offset 128=0x80.
  # Used with linear access for single bytes 0..0xbf for simple error handling.
  # Length 64=0x40, not DATA_BLOCK_LENGTH.
  BAD_UTF8_DATA_OFFSET = 0x80

  # The start of non-linear-ASCII data blocks, at offset 192=0xc0.
  # !!!!
  DATA_START_OFFSET = 0xc0

  # The null data block.
  # Length 64=0x40 even if DATA_BLOCK_LENGTH is smaller,
  # to work with 6-bit trail bytes from 2-byte UTF-8.
  DATA_NULL_OFFSET = DATA_START_OFFSET

  # The start of allocated data blocks.
  NEW_DATA_START_OFFSET = DATA_NULL_OFFSET + 0x40

  # The start of data blocks for U+0800 and above.
  # Below, compaction uses a block length of 64 for 2-byte UTF-8.
  # From here on, compaction uses DATA_BLOCK_LENGTH.
  # Data values for 0x780 code points beyond ASCII.
  DATA_0800_OFFSET = NEW_DATA_START_OFFSET + 0x780

  # Start with allocation of 16k data entries. */
  INITIAL_DATA_LENGTH = 1 << 14

  # Grow about 8x each time.
  MEDIUM_DATA_LENGTH = 1 << 17

  # Maximum length of the runtime data array.
  # Limited by 16-bit index values that are left-shifted by INDEX_SHIFT,
  # and by uint16_t UTrie2Header.shiftedDataLength.
  MAX_DATA_LENGTH = 0xffff << INDEX_SHIFT

  INDEX_1_LENGTH = 0x110000 >> SHIFT_1

  # Maximum length of the build-time data array.
  # One entry per 0x110000 code points, plus the illegal-UTF-8 block and the null block,
  # plus values for the 0x400 surrogate code units.
  MAX_DATA_LENGTH = 0x110000 + 0x40 + 0x40 + 0x400

  # At build time, leave a gap in the index-2 table,
  # at least as long as the maximum lengths of the 2-byte UTF-8 index-2 table
  # and the supplementary index-1 table.
  # Round up to INDEX_2_BLOCK_LENGTH for proper compacting.
  INDEX_GAP_OFFSET = INDEX_2_BMP_LENGTH
  INDEX_GAP_LENGTH = ((UTF8_2B_INDEX_2_LENGTH + MAX_INDEX_1_LENGTH) + INDEX_2_MASK) & ~INDEX_2_MASK

  # Maximum length of the build-time index-2 array.
  # Maximum number of Unicode code points (0x110000) shifted right by SHIFT_2,
  # plus the part of the index-2 table for lead surrogate code points,
  # plus the build-time index gap,
  # plus the null index-2 block.)
  MAX_INDEX_2_LENGTH = (0x110000 >> SHIFT_2) + LSCP_INDEX_2_LENGTH + INDEX_GAP_LENGTH + INDEX_2_BLOCK_LENGTH

  # The null index-2 block, following the gap in the index-2 table.
  INDEX_2_NULL_OFFSET = INDEX_GAP_OFFSET + INDEX_GAP_LENGTH

  # The start of allocated index-2 blocks.
  INDEX_2_START_OFFSET = INDEX_2_NULL_OFFSET + INDEX_2_BLOCK_LENGTH

  # Maximum length of the runtime index array.
  # Limited by its own 16-bit index values, and by uint16_t UTrie2Header.indexLength.
  # (The actual maximum length is lower,
  # (0x110000>>SHIFT_2)+UTF8_2B_INDEX_2_LENGTH+MAX_INDEX_1_LENGTH.)
  MAX_INDEX_LENGTH = 0xffff

  constructor: (@initialValue = 0, @errorValue = 0) ->
    @index1 = new Int32Array INDEX_1_LENGTH
    @index2 = new Int32Array MAX_INDEX_2_LENGTH
    @highStart = 0x110000

    @data = new Uint32Array INITIAL_DATA_LENGTH
    @dataCapacity = INITIAL_DATA_LENGTH

    @firstFreeBlock = 0
    @isCompacted = false

    # Multi-purpose per-data-block table.
    #
    # Before compacting:
    #
    # Per-data-block reference counters/free-block list.
    #  0: unused
    # >0: reference counter (number of index-2 entries pointing here)
    # <0: next free data block in free-block list
    #
    # While compacting:
    #
    # Map of adjusted indexes, used in compactData() and compactIndex2().
    # Maps from original indexes to new ones.
    @map = new Int32Array MAX_DATA_LENGTH >> SHIFT_2

    for i in [0...0x80] by 1
      @data[i] = @initialValue

    for i in [i...0xc0] by 1
      @data[i] = @errorValue

    for i in [DATA_NULL_OFFSET...NEW_DATA_START_OFFSET] by 1
      @data[i] = @initialValue

    @dataNullOffset = DATA_NULL_OFFSET
    @dataLength = NEW_DATA_START_OFFSET

    # set the index-2 indexes for the 2=0x80>>SHIFT_2 ASCII data blocks
    i = 0
    for j in [0...0x80] by DATA_BLOCK_LENGTH
      @index2[i] = j
      @map[i++] = 1

    # reference counts for the bad-UTF-8-data block
    for j in [j...0xc0] by DATA_BLOCK_LENGTH
      @map[i++] = 0

    # Reference counts for the null data block: all blocks except for the ASCII blocks.
    # Plus 1 so that we don't drop this block during compaction.
    # Plus as many as needed for lead surrogate code points.
    # i==newTrie->dataNullOffset
    @map[i++] = (0x110000 >> SHIFT_2) - (0x80 >> SHIFT_2) + 1 + LSCP_INDEX_2_LENGTH
    j += DATA_BLOCK_LENGTH
    for j in [j...NEW_DATA_START_OFFSET] by DATA_BLOCK_LENGTH
      @map[i++] = 0

    # set the remaining indexes in the BMP index-2 block
    # to the null data block
    for i in [0x80 >> SHIFT_2...INDEX_2_BMP_LENGTH] by 1
      @index2[i] = DATA_NULL_OFFSET

    # Fill the index gap with impossible values so that compaction
    # does not overlap other index-2 blocks with the gap.
    for i in [0...INDEX_GAP_LENGTH] by 1
      @index2[INDEX_GAP_OFFSET + i] = -1

    # set the indexes in the null index-2 block
    for i in [0...INDEX_2_BLOCK_LENGTH] by 1
      @index2[INDEX_2_NULL_OFFSET + i] = DATA_NULL_OFFSET

    @index2NullOffset = INDEX_2_NULL_OFFSET
    @index2Length = INDEX_2_START_OFFSET

    # set the index-1 indexes for the linear index-2 block
    j = 0
    for i in [0...OMITTED_BMP_INDEX_1_LENGTH] by 1
      @index1[i] = j
      j += INDEX_2_BLOCK_LENGTH

    # set the remaining index-1 indexes to the null index-2 block
    for i in [i...INDEX_1_LENGTH] by 1
      @index1[i] = INDEX_2_NULL_OFFSET

    # Preallocate and reset data for U+0080..U+07ff,
    # for 2-byte UTF-8 which will be compacted in 64-blocks
    # even if DATA_BLOCK_LENGTH is smaller.
    for i in [0x80...0x800] by DATA_BLOCK_LENGTH
      @set i, @initialValue
      
    return

  set: (codePoint, value) ->
    if codePoint < 0 or codePoint > 0x10ffff
      throw new Error 'Invalid code point'

    if @isCompacted
      throw new Error 'Already compacted'

    block = @_getDataBlock codePoint, true
    @data[block + (codePoint & DATA_MASK)] = value
    return this

  setRange: (start, end, value, overwrite = true) ->
    if start > 0x10ffff or end > 0x10ffff or start > end
      throw new Error 'Invalid code point'

    if @isCompacted
      throw new Error 'Already compacted'

    if not overwrite and value is @initialValue
      return this # nothing to do

    limit = end + 1
    if (start & DATA_MASK) isnt 0
      # set partial block at [start..following block boundary
      block = @_getDataBlock start, true

      nextStart = (start + DATA_BLOCK_LENGTH) & ~DATA_MASK
      if nextStart <= limit
        @_fillBlock block, start & DATA_MASK, DATA_BLOCK_LENGTH, value, @initialValue, overwrite
        start = nextStart
      else
        @_fillBlock block, start & DATA_MASK, limit & DATA_MASK, value, @initialValue, overwrite
        return this

    # number of positions in the last, partial block
    rest = limit & DATA_MASK

    # round down limit to a block boundary
    limit &= ~DATA_MASK

    # iterate over all-value blocks
    if value is @initialValue
      repeatBlock = @dataNullOffset
    else
      repeatBlock = -1

    while start < limit
      setRepeatBlock = false

      if value is @initialValue and @_isInNullBlock start, true
        start += DATA_BLOCK_LENGTH # nothing to do
        continue

      # get index value
      i2 = @_getIndex2Block start, true
      i2 += (start >> SHIFT_2) & INDEX_2_MASK

      block = @index2[i2]
      if @_isWritableBlock block
        # already allocated
        if overwrite and block >= DATA_0800_OFFSET
          # We overwrite all values, and it's not a
          # protected (ASCII-linear or 2-byte UTF-8) block:
          # replace with the repeatBlock.
          setRepeatBlock = true
        else
          # protected block: just write the values into this block
          @_fillBlock block, 0, DATA_BLOCK_LENGTH, value, @initialValue, overwrite

      else if @data[block] isnt value and (overwrite or block is @dataNullOffset)
        # Set the repeatBlock instead of the null block or previous repeat block:
        #
        # If !isWritableBlock() then all entries in the block have the same value
        # because it's the null block or a range block (the repeatBlock from a previous
        # call to utrie2_setRange32()).
        # No other blocks are used multiple times before compacting.
        #
        # The null block is the only non-writable block with the initialValue because
        # of the repeatBlock initialization above. (If value==initialValue, then
        # the repeatBlock will be the null data block.)
        #
        # We set our repeatBlock if the desired value differs from the block's value,
        # and if we overwrite any data or if the data is all initial values
        # (which is the same as the block being the null block, see above).
        setRepeatBlock = true

      if setRepeatBlock
        if repeatBlock >= 0
          @_setIndex2Entry i2, repeatBlock
        else
          # create and set and fill the repeatBlock
          repeatBlock = @_getDataBlock start, true
          @_writeBlock repeatBlock, value

      start += DATA_BLOCK_LENGTH

    if rest > 0
      # set partial block at [last block boundary..limit
      block = @_getDataBlock start, true
      @_fillBlock block, 0, rest, value, @initialValue, overwrite

    return this

  get: (c, fromLSCP = true) ->
    if c < 0 or c > 0x10ffff
      return @errorValue

    if c >= @highStart and (!(c >= 0xd800 and c < 0xdc00) or fromLSCP)
      return @data[@dataLength - DATA_GRANULARITY];

    if (c >= 0xd800 and c < 0xdc00) and fromLSCP
      i2 = (LSCP_INDEX_2_OFFSET - (0xd800 >> SHIFT_2)) + (c >> SHIFT_2)
    else
      i2 = @index1[c >> SHIFT_1] + ((c >> SHIFT_2) & INDEX_2_MASK)

    block = @index2[i2]
    return @data[block + (c & DATA_MASK)]

  _isInNullBlock: (c, forLSCP) ->
    if (c & 0xfffffc00) is 0xd800 and forLSCP
      i2 = LSCP_INDEX_2_OFFSET - (0xd800 >> SHIFT_2) + (c >> SHIFT_2)
    else
      i2 = @index1[c >> SHIFT_1] + ((c >> SHIFT_2) & INDEX_2_MASK)

    block = @index2[i2]
    return block is @dataNullOffset

  _allocIndex2Block: ->
    newBlock = @index2Length
    newTop = newBlock + INDEX_2_BLOCK_LENGTH
    if newTop > @index2.length
      # Should never occur.
      # Either MAX_BUILD_TIME_INDEX_LENGTH is incorrect,
      # or the code writes more values than should be possible.
      throw new Error("Internal error in Trie2 creation.");

    @index2Length = newTop
    @index2.set(@index2.subarray(@index2NullOffset, @index2NullOffset + INDEX_2_BLOCK_LENGTH), newBlock)

    return newBlock

  _getIndex2Block: (c, forLSCP) ->
    if c >= 0xd800 and c < 0xdc00 and forLSCP
      return LSCP_INDEX_2_OFFSET

    i1 = c >> SHIFT_1
    i2 = @index1[i1]
    if i2 is @index2NullOffset
      i2 = @_allocIndex2Block()
      @index1[i1] = i2

    return i2

  _isWritableBlock: (block) ->
    return block isnt @dataNullOffset and @map[block >> SHIFT_2] is 1

  _allocDataBlock: (copyBlock) ->
    if @firstFreeBlock isnt 0
      # get the first free block
      newBlock = @firstFreeBlock
      @firstFreeBlock = -@map[newBlock >> SHIFT_2]
    else
      # get a new block from the high end
      newBlock = @dataLength
      newTop = newBlock + DATA_BLOCK_LENGTH
      if newTop > @dataCapacity
        # out of memory in the data array
        if @dataCapacity < MEDIUM_DATA_LENGTH
          capacity = MEDIUM_DATA_LENGTH
        else if @dataCapacity < MAX_DATA_LENGTH
          capacity = MAX_DATA_LENGTH
        else
          # Should never occur.
          # Either MAX_DATA_LENGTH is incorrect,
          # or the code writes more values than should be possible.
          throw new Error("Internal error in Trie2 creation.");

        newData = new Uint32Array(capacity)
        newData.set(@data.subarray(0, @dataLength))
        @data = newData
        @dataCapacity = capacity

      @dataLength = newTop

    @data.set(@data.subarray(copyBlock, copyBlock + DATA_BLOCK_LENGTH), newBlock)
    @map[newBlock >> SHIFT_2] = 0
    return newBlock

  _releaseDataBlock: (block) ->
    # put this block at the front of the free-block chain
    @map[block >> SHIFT_2] = -@firstFreeBlock
    @firstFreeBlock = block

  _setIndex2Entry: (i2, block) ->
    ++@map[block >> SHIFT_2]  # increment first, in case block == oldBlock!
    oldBlock = @index2[i2]
    if --@map[oldBlock >> SHIFT_2] is 0
      @_releaseDataBlock oldBlock

    @index2[i2] = block

  _getDataBlock: (c, forLSCP) ->
    i2 = @_getIndex2Block c, forLSCP
    i2 += (c >> SHIFT_2) & INDEX_2_MASK

    oldBlock = @index2[i2]
    if @_isWritableBlock oldBlock
      return oldBlock

    # allocate a new data block
    newBlock = @_allocDataBlock oldBlock
    @_setIndex2Entry i2, newBlock
    return newBlock

  _fillBlock: (block, start, limit, value, initialValue, overwrite) ->
    if overwrite
      for i in [block+start...block+limit] by 1
        @data[i] = value
    else
      for i in [block+start...block+limit] by 1
        if @data[i] is initialValue
          @data[i] = value

    return

  _writeBlock: (block, value) ->
    limit = block + DATA_BLOCK_LENGTH
    while block < limit
      @data[block++] = value

    return

  _findHighStart: (highValue) ->
    data32 = @data
    initialValue = @initialValue
    index2NullOffset = @index2NullOffset
    nullBlock = @dataNullOffset

    # set variables for previous range
    if highValue is initialValue
      prevI2Block = index2NullOffset
      prevBlock = nullBlock
    else
      prevI2Block = -1
      prevBlock = -1

    prev = 0x110000

    # enumerate index-2 blocks
    i1 = INDEX_1_LENGTH
    c = prev
    while c > 0
      i2Block = @index1[--i1]
      if i2Block is prevI2Block
        # the index-2 block is the same as the previous one, and filled with highValue
        c -= CP_PER_INDEX_1_ENTRY
        continue

      prevI2Block = i2Block
      if i2Block is index2NullOffset
        # this is the null index-2 block
        return c unless highValue is initialValue
        c -= CP_PER_INDEX_1_ENTRY
      else
        # enumerate data blocks for one index-2 block
        i2 = INDEX_2_BLOCK_LENGTH
        while i2 > 0
          block = @index2[i2Block + --i2]
          if block is prevBlock
            # the block is the same as the previous one, and filled with highValue
            c -= DATA_BLOCK_LENGTH
            continue

          prevBlock = block
          if block is nullBlock
            # this is the null data block
            return c unless highValue is initialValue
            c -= DATA_BLOCK_LENGTH
          else
            j = DATA_BLOCK_LENGTH
            while j > 0
              value = data32[block + --j]
              return c unless value is highValue
              --c

    # deliver last range
    return 0

  equal_int = (a, s, t, length) ->
    for i in [0...length] by 1
      return false unless a[s + i] is a[t + i]

    return true

  _findSameDataBlock: (dataLength, otherBlock, blockLength) ->
    # ensure that we do not even partially get past dataLength
    dataLength -= blockLength
    block = 0
    while block <= dataLength
      return block if equal_int(@data, block, otherBlock, blockLength)
      block += DATA_GRANULARITY

    return -1

  _findSameIndex2Block: (index2Length, otherBlock) ->
    # ensure that we do not even partially get past index2Length
    index2Length -= INDEX_2_BLOCK_LENGTH
    for block in [0..index2Length] by 1
      return block if equal_int(@index2, block, otherBlock, INDEX_2_BLOCK_LENGTH)

    return -1

  _compactData: ->
    # do not compact linear-ASCII data
    newStart = DATA_START_OFFSET
    start = 0
    i = 0

    while start < newStart
      @map[i++] = start
      start += DATA_BLOCK_LENGTH

    # Start with a block length of 64 for 2-byte UTF-8,
    # then switch to DATA_BLOCK_LENGTH.
    blockLength = 64
    blockCount = blockLength >> SHIFT_2
    start = newStart
    while start < @dataLength
      # start: index of first entry of current block
      # newStart: index where the current block is to be moved
      #           (right after current end of already-compacted data)
      if start is DATA_0800_OFFSET
        blockLength = DATA_BLOCK_LENGTH
        blockCount = 1

      # skip blocks that are not used
      if @map[start >> SHIFT_2] <= 0
        # advance start to the next block
        start += blockLength

        # leave newStart with the previous block!
        continue

      # search for an identical block
      if (movedStart = @_findSameDataBlock(newStart, start, blockLength)) >= 0
        # found an identical block, set the other block's index value for the current block
        mapIndex = start >> SHIFT_2
        for i in [blockCount...0] by -1
          @map[mapIndex++] = movedStart
          movedStart += DATA_BLOCK_LENGTH

        # advance start to the next block
        start += blockLength

        # leave newStart with the previous block!
        continue

      # see if the beginning of this block can be overlapped with the end of the previous block
      # look for maximum overlap (modulo granularity) with the previous, adjacent block
      overlap = blockLength - DATA_GRANULARITY
      while overlap > 0 and not equal_int(@data, (newStart - overlap), start, overlap)
        overlap -= DATA_GRANULARITY

      if overlap > 0 or newStart < start
        # some overlap, or just move the whole block
        movedStart = newStart - overlap
        mapIndex = start >> SHIFT_2

        for i in [blockCount...0] by -1
          @map[mapIndex++] = movedStart
          movedStart += DATA_BLOCK_LENGTH

        # move the non-overlapping indexes to their new positions
        start += overlap
        for i in [blockLength - overlap...0] by -1
          @data[newStart++] = @data[start++]

      else # no overlap && newStart==start
        mapIndex = start >> SHIFT_2
        for i in [blockCount...0] by -1
          @map[mapIndex++] = start
          start += DATA_BLOCK_LENGTH

        newStart = start

    # now adjust the index-2 table
    i = 0
    while i < @index2Length
      # Gap indexes are invalid (-1). Skip over the gap.
      i += INDEX_GAP_LENGTH  if i is INDEX_GAP_OFFSET
      @index2[i] = @map[@index2[i] >> SHIFT_2]
      ++i

    @dataNullOffset = @map[@dataNullOffset >> SHIFT_2]

    # ensure dataLength alignment
    @data[newStart++] = @initialValue  until (newStart & (DATA_GRANULARITY - 1)) is 0
    @dataLength = newStart
    return

  _compactIndex2: ->
    # do not compact linear-BMP index-2 blocks
    newStart = INDEX_2_BMP_LENGTH
    start = 0
    i = 0

    while start < newStart
      @map[i++] = start
      start += INDEX_2_BLOCK_LENGTH

    # Reduce the index table gap to what will be needed at runtime.
    newStart += UTF8_2B_INDEX_2_LENGTH + ((@highStart - 0x10000) >> SHIFT_1)
    start = INDEX_2_NULL_OFFSET
    while start < @index2Length
      # start: index of first entry of current block
      # newStart: index where the current block is to be moved
      #           (right after current end of already-compacted data)

      # search for an identical block
      if (movedStart = @_findSameIndex2Block(newStart, start)) >= 0
        # found an identical block, set the other block's index value for the current block
        @map[start >> SHIFT_1_2] = movedStart

        # advance start to the next block
        start += INDEX_2_BLOCK_LENGTH

        # leave newStart with the previous block!
        continue

      # see if the beginning of this block can be overlapped with the end of the previous block
      # look for maximum overlap with the previous, adjacent block
      overlap = INDEX_2_BLOCK_LENGTH - 1
      while overlap > 0 and not equal_int(@index2, (newStart - overlap), start, overlap)
        --overlap

      if overlap > 0 or newStart < start
        # some overlap, or just move the whole block
        @map[start >> SHIFT_1_2] = newStart - overlap

        # move the non-overlapping indexes to their new positions
        start += overlap
        for i in [INDEX_2_BLOCK_LENGTH - overlap...0] by -1
          @index2[newStart++] = @index2[start++]

      else # no overlap && newStart==start
        @map[start >> SHIFT_1_2] = start
        start += INDEX_2_BLOCK_LENGTH
        newStart = start

    # now adjust the index-1 table
    for i in [0...INDEX_1_LENGTH] by 1
      @index1[i] = @map[@index1[i] >> SHIFT_1_2]

    @index2NullOffset = @map[@index2NullOffset >> SHIFT_1_2]

    # Ensure data table alignment:
    # Needs to be granularity-aligned for 16-bit trie
    # (so that dataMove will be down-shiftable),
    # and 2-aligned for uint32_t data.

    # Arbitrary value: 0x3fffc not possible for real data.
    until (newStart & ((DATA_GRANULARITY - 1) | 1)) is 0
      @index2[newStart++] = 0x0000ffff << INDEX_SHIFT

    @index2Length = newStart

  _compact: ->
    # find highStart and round it up
    highValue = @get 0x10ffff
    highStart = @_findHighStart highValue
    highStart = (highStart + (CP_PER_INDEX_1_ENTRY - 1)) & ~(CP_PER_INDEX_1_ENTRY - 1)
    if highStart is 0x110000
      highValue = @errorValue

    # Set trie->highStart only after utrie2_get32(trie, highStart).
    # Otherwise utrie2_get32(trie, highStart) would try to read the highValue.
    @highStart = highStart
    if @highStart < 0x110000
      # Blank out [highStart..10ffff] to release associated data blocks.
      suppHighStart = if @highStart <= 0x10000 then 0x10000 else @highStart
      @setRange suppHighStart, 0x10ffff, @initialValue, true

    @_compactData()
    if @highStart > 0x10000
      @_compactIndex2()

    # Store the highValue in the data array and round up the dataLength.
    # Must be done after compactData() because that assumes that dataLength
    # is a multiple of DATA_BLOCK_LENGTH.
    @data[@dataLength++] = highValue
    until (@dataLength & (DATA_GRANULARITY - 1)) is 0
      @data[@dataLength++] = @initialValue

    @isCompacted = true

  freeze: ->
    unless @isCompacted
      @_compact()

    if @highStart <= 0x10000
      allIndexesLength = INDEX_1_OFFSET
    else
      allIndexesLength = @index2Length

    dataMove = allIndexesLength

    # for shiftedDataLength
    if allIndexesLength > MAX_INDEX_LENGTH or
       (dataMove + @dataNullOffset) > 0xffff or
       (dataMove + DATA_0800_OFFSET) > 0xffff or
       (dataMove + @dataLength) > MAX_DATA_LENGTH
      throw new Error("Trie data is too large.")

    # calculate the sizes of, and allocate, the index and data arrays
    indexLength = allIndexesLength + @dataLength
    data = new Int32Array(indexLength)

    # write the index-2 array values shifted right by INDEX_SHIFT, after adding dataMove
    destIdx = 0
    for i in [0...INDEX_2_BMP_LENGTH] by 1
      data[destIdx++] = ((@index2[i] + dataMove) >> INDEX_SHIFT)

    # write UTF-8 2-byte index-2 values, not right-shifted
    for i in [0...(0xc2 - 0xc0)] by 1 # C0..C1
      data[destIdx++] = (dataMove + BAD_UTF8_DATA_OFFSET)

    for i in [i...(0xe0 - 0xc0)] by 1 # C2..DF
      data[destIdx++] = (dataMove + @index2[i << (6 - SHIFT_2)])

    if @highStart > 0x10000
      index1Length = (@highStart - 0x10000) >> SHIFT_1
      index2Offset = INDEX_2_BMP_LENGTH + UTF8_2B_INDEX_2_LENGTH + index1Length

      # write 16-bit index-1 values for supplementary code points
      for i in [0...index1Length] by 1
        data[destIdx++] = (INDEX_2_OFFSET + @index1[i + OMITTED_BMP_INDEX_1_LENGTH])

      # write the index-2 array values for supplementary code points,
      # shifted right by INDEX_SHIFT, after adding dataMove
      for i in [0...@index2Length - index2Offset] by 1
        data[destIdx++] = ((dataMove + @index2[index2Offset + i]) >> INDEX_SHIFT)

    # write 16-bit data values
    for i in [0...@dataLength] by 1
      data[destIdx++] = @data[i]

    dest = new UnicodeTrie
      data: data
      highStart: @highStart
      errorValue: @errorValue

    return dest

  # Generates a Buffer containing the serialized and compressed trie.
  # Trie data is compressed twice using the deflate algorithm to minimize file size.
  # Format:
  #   uint32_t highStart;
  #   uint32_t errorValue;
  #   uint32_t uncompressedDataLength;
  #   uint8_t trieData[dataLength];
  toBuffer: ->
    trie = @freeze()

    data = new Uint8Array(trie.data.buffer)
    compressed = pako.deflateRaw data
    compressed = pako.deflateRaw compressed

    buf = new Buffer compressed.length + 12
    buf.writeUInt32BE trie.highStart, 0
    buf.writeUInt32BE trie.errorValue, 4
    buf.writeUInt32BE data.length, 8
    for b, i in compressed
      buf[i + 12] = b

    return buf

module.exports = UnicodeTrieBuilder
