//   Copyright 2009 The Closure Library Authors. All Rights Reserved.

/**
 * @fileoverview A generator of lorem ipsum text based on the python
 * implementation at http://code.google.com/p/lorem-ipsum-generator/.
 *
 */

goog.provide('goog.text.LoremIpsum');

goog.require('goog.array');
goog.require('goog.math');
goog.require('goog.string');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');


/**
 * Generates random strings of "lorem ipsum" text, based on the word
 * distribution of a sample text, using the words in a dictionary.
 * @constructor
 */
goog.text.LoremIpsum = function() {
  this.generateChains_(this.sample_);
  this.generateStatistics_(this.sample_);

  this.initializeDictionary_(this.dictionary_);
};


/**
 * Delimiters that end sentences.
 * @type {Array.<string>}
 * @private
 */
goog.text.LoremIpsum.DELIMITERS_SENTENCES_ = ['.', '?', '!'];


/**
 * Regular expression for spliting a text into sentences.
 * @type {RegExp}
 * @private
 */
goog.text.LoremIpsum.SENTENCE_SPLIT_REGEX_ = /[\.\?\!]/;


/**
 * Delimiters that end words.
 * @type {Array.<string>}
 * @private
 */
goog.text.LoremIpsum.DELIMITERS_WORDS_ = [',', '.', '?', '!'];


/**
 * Regular expression for spliting text into words.
 * @type {RegExp}
 * @private
 */
goog.text.LoremIpsum.WORD_SPLIT_REGEX_ = /\s/;


/**
 * Words that can be used in the generated output.
 * Maps a word-length to a list of words of that length.
 * @type {goog.structs.Map}
 * @private
 */
goog.text.LoremIpsum.prototype.words_;


/**
 * Chains of three words that appear in the sample text
 * Maps a pair of word-lengths to a third word-length and an optional
 * piece of trailing punctuation (for example, a period, comma, etc.).
 * @type {goog.structs.Map}
 * @private
 */
goog.text.LoremIpsum.prototype.chains_;


/**
 * Pairs of word-lengths that can appear at the beginning of sentences.
 * @type {Array}
 */
goog.text.LoremIpsum.prototype.starts_;


/**
 * Averange sentence length in words.
 * @type {number}
 * @private
 */
goog.text.LoremIpsum.prototype.sentenceMean_;


/**
 * Sigma (sqrt of variance) for the sentence length in words.
 * @type {number}
 * @private
 */
goog.text.LoremIpsum.prototype.sentenceSigma_;


/**
 * Averange paragraph length in sentences.
 * @type {number}
 * @private
 */
goog.text.LoremIpsum.prototype.paragraphMean_;


/**
 * Sigma (sqrt of variance) for the paragraph length in sentences.
 * @type {number}
 * @private
 */
goog.text.LoremIpsum.prototype.paragraphSigma_;


/**
 * Generates the chains and starts values required for sentence generation.
 * @param {string} sample The same text.
 * @private
 */
goog.text.LoremIpsum.prototype.generateChains_ = function(sample) {
  var words = goog.text.LoremIpsum.splitWords_(sample);
  var wordInfo = goog.array.map(words, goog.text.LoremIpsum.getWordInfo_);

  var previous = [0, 0];
  var previousKey = previous.join('-');
  var chains = new goog.structs.Map();
  var starts = [previousKey];
  var chainKeys = {};

  goog.array.forEach(wordInfo, function(pair) {
    var chain = chains.get(previousKey);
    if (chain) {
      chain.push(pair);
    } else {
      chain = [pair];
      chains.set(previousKey, chain);
    }

    if (goog.array.contains(
        goog.text.LoremIpsum.DELIMITERS_SENTENCES_, pair[1])) {
      starts.push(previousKey);
    }
    chainKeys[previousKey] = previous;
    previous = [previous[1], pair[0]];
    previousKey = previous.join('-');
  });

  if (chains.getCount() > 0) {
    this.chains_ = chains;
    this.starts_ = starts;
    this.chainKeys_ = chainKeys;
  } else {
    throw Error('Could not generate chains from sample text.');
  }
};


/**
 * Calculates the mean and standard deviation of sentence and paragraph lengths.
 * @param {string} sample The same text.
 * @private
 */
goog.text.LoremIpsum.prototype.generateStatistics_ = function(sample) {
  this.generateSentenceStatistics_(sample);
  this.generateParagraphStatistics_(sample);
};


/**
 * Calculates the mean and standard deviation of the lengths of sentences
 * (in words) in a sample text.
 * @param {string} sample The same text.
 * @private
 */
goog.text.LoremIpsum.prototype.generateSentenceStatistics_ = function(sample) {
  var sentences = goog.array.filter(
      goog.text.LoremIpsum.splitSentences_(sample),
      goog.text.LoremIpsum.isNotEmptyOrWhitepace_);

  var sentenceLengths = goog.array.map(
      goog.array.map(sentences, goog.text.LoremIpsum.splitWords_),
      goog.text.LoremIpsum.arrayLength_);
  this.sentenceMean_ = goog.math.average.apply(null, sentenceLengths);
  this.sentenceSigma_ = goog.math.standardDeviation.apply(
      null, sentenceLengths);
};


/**
 * Calculates the mean and standard deviation of the lengths of paragraphs
 * (in sentences) in a sample text.
 * @param {string} sample The same text.
 * @private
 */
goog.text.LoremIpsum.prototype.generateParagraphStatistics_ = function(sample) {
  var paragraphs = goog.array.filter(
      goog.text.LoremIpsum.splitParagraphs_(sample),
      goog.text.LoremIpsum.isNotEmptyOrWhitepace_);

  var paragraphLengths = goog.array.map(
    goog.array.map(paragraphs, goog.text.LoremIpsum.splitSentences_),
    goog.text.LoremIpsum.arrayLength_);

  this.paragraphMean_ = goog.math.average.apply(null, paragraphLengths);
  this.paragraphSigma_ = goog.math.standardDeviation.apply(
      null, paragraphLengths);
};


/**
 * Sets the generator to use a given selection of words for generating
 * sentences with.
 * @param {string} dictionary The dictionary to use.
 */
goog.text.LoremIpsum.prototype.initializeDictionary_ = function(dictionary) {
  var dictionaryWords = goog.text.LoremIpsum.splitWords_(dictionary);

  var words = new goog.structs.Map();
  goog.array.forEach(dictionaryWords, function(word) {
    var set = words.get(word.length);
    if (!set) {
      set = new goog.structs.Set();
      words.set(word.length, set);
    }
    set.add(word);
  });

  this.words_ = words;
};


/**
 * Picks a random starting chain.
 * @return {Array.<string>} The starting key.
 * @private
 */
goog.text.LoremIpsum.prototype.chooseRandomStart_ = function() {
  var key = goog.text.LoremIpsum.randomChoice_(this.starts_);
  return this.chainKeys_[key];
};


/**
 * Generates a single sentence, of random length.
 * @param {boolean} opt_startWithLorem Whether to start the setnence with the
 *     standard "Lorem ipsum..." first sentence.
 * @return {string} The generated sentence.
 */
goog.text.LoremIpsum.prototype.generateSentence = function(opt_startWithLorem) {
  if (this.chains_.getCount() == 0 || this.starts_.length == 0) {
    throw Error('No chains created');
  }

  if (this.words_.getCount() == 0) {
    throw Error('No dictionary');
  }

  // The length of the sentence is a normally distributed random variable.
  var sentenceLength = goog.text.LoremIpsum.randomNormal_(
      this.sentenceMean_, this.sentenceSigma_)
  sentenceLength = Math.max(Math.floor(sentenceLength), 1);

  var wordDelimiter = ''; // Defined here in case while loop doesn't run

  // Start the sentence with "Lorem ipsum...", if desired
  var sentence;
  if (opt_startWithLorem) {
    var lorem = 'lorem ipsum dolor sit amet, consecteteur adipiscing elit';
    sentence = goog.text.LoremIpsum.splitWords_(lorem);
    if (sentence.length > sentenceLength) {
      sentence.length = sentenceLength;
    }
    var lastWord = sentence[sentence.length - 1];
    var lastChar = lastWord.substring(lastWord.length - 1);
    if (goog.array.contains(goog.text.LoremIpsum.DELIMITERS_WORDS_, lastChar)) {
      wordDelimiter = lastChar;
    }
  } else {
    sentence = [];
  }

  var previous = [];
  var previousKey = '';
  // Generate a sentence from the "chains"
  while (sentence.length < sentenceLength) {
    // If the current starting point is invalid, choose another randomly
    if (!this.chains_.containsKey(previousKey)) {
      previous = this.chooseRandomStart_();
      previousKey = previous.join('-');
    }

    // Choose the next "chain" to go to. This determines the next word
    // length we'll use, and whether there is e.g. a comma at the end of
    // the word.
    var chain = /** @type {Array} */ (goog.text.LoremIpsum.randomChoice_(
        /** @type {Array} */ (this.chains_.get(previousKey))));
    var wordLength = chain[0];

    // If the word delimiter contained in the chain is also a sentence
    // delimiter, then we don't include it because we don't want the
    // sentence to end prematurely (we want the length to match the
    // sentence_length value).
    //debugger;
    if (goog.array.contains(goog.text.LoremIpsum.DELIMITERS_SENTENCES_,
        chain[1])) {
      wordDelimiter = '';
    } else {
      wordDelimiter = chain[1];
    }

    // Choose a word randomly that matches (or closely matches) the
    // length we're after.
    var closestLength = goog.text.LoremIpsum.chooseClosest(
            this.words_.getKeys(), wordLength);
    var word = goog.text.LoremIpsum.randomChoice_(
        this.words_.get(closestLength).getValues());

    sentence.push(word + wordDelimiter);
    previous = [previous[1], wordLength];
    previousKey = previous.join('-');
  }

  // Finish the sentence off with capitalisation, a period and
  // form it into a string
  sentence = sentence.join(' ');
  sentence = sentence.slice(0, 1).toUpperCase() + sentence.slice(1);
  if (sentence.substring(sentence.length - 1) == wordDelimiter) {
    sentence = sentence.slice(0, sentence.length - 1);
  }
  return sentence + '.';
};

/**
 * Generates a single lorem ipsum paragraph, of random length.
 * @param {boolean} opt_startWithLorem Whether to start the sentence with the
 *     standard "Lorem ipsum..." first sentence.
 * @return {string} The generated sentence.
 */
goog.text.LoremIpsum.prototype.generateParagraph = function(
    opt_startWithLorem) {
  // The length of the paragraph is a normally distributed random variable.
  var paragraphLength = goog.text.LoremIpsum.randomNormal_(
      this.paragraphMean_, this.paragraphSigma_);
  paragraphLength = Math.max(Math.floor(paragraphLength), 1);

  // Construct a paragraph from a number of sentences.
  var paragraph = []
  var startWithLorem = opt_startWithLorem;
  while (paragraph.length < paragraphLength) {
      var sentence = this.generateSentence(startWithLorem);
      paragraph.push(sentence);
      startWithLorem = false;
  }

  // Form the paragraph into a string.
  paragraph = paragraph.join(' ')
  return paragraph
};


/**
 * Splits a piece of text into paragraphs.
 * @param {string} text The text to split.
 * @return {Array.<string>} An array of paragraphs.
 * @private
 */
goog.text.LoremIpsum.splitParagraphs_ = function(text) {
  return text.split('\n')
};


/**
 * Splits a piece of text into sentences.
 * @param {string} text The text to split.
 * @return {Array.<string>} An array of sentences.
 * @private
 */
goog.text.LoremIpsum.splitSentences_ = function(text) {
  return goog.array.filter(
      text.split(goog.text.LoremIpsum.SENTENCE_SPLIT_REGEX_),
      goog.text.LoremIpsum.isNotEmptyOrWhitepace_);
};


/**
 * Splits a piece of text into words..
 * @param {string} text The text to split.
 * @return {Array.<string>} An array of words.
 * @private
 */
goog.text.LoremIpsum.splitWords_ = function(text) {
  return goog.array.filter(
      text.split(goog.text.LoremIpsum.WORD_SPLIT_REGEX_),
      goog.text.LoremIpsum.isNotEmptyOrWhitepace_);
};


/**
 * Returns the text is not empty or just whitespace.
 * @param {string} text The text to check.
 * @return {boolean} Whether the text is nether empty nor whitespace.
 * @private
 */
goog.text.LoremIpsum.isNotEmptyOrWhitepace_ = function(text) {
  return goog.string.trim(text).length > 0;
};


/**
 * Returns the length of an array. Written as a function so it can be used
 * as a function parameter.
 * @param {Array} array The array to check.
 * @return {number} The length of the array.
 */
goog.text.LoremIpsum.arrayLength_ = function(array) {
  return array.length;
};


/**
 * Find the number in the list of values that is closest to the target.
 * @param {Array.<number>} values The values.
 * @param {number} target The target value.
 * @return {number} The closest value.
 */
goog.text.LoremIpsum.chooseClosest = function(values, target) {
  var closest = values[0];
  goog.array.forEach(values, function(value) {
    if (Math.abs(target - value) < Math.abs(target - closest)) {
      closest = value;
    }
  });

  return closest;
};

/**
 * Gets info about a word used as part of the lorem ipsum algorithm.
 * @param {string} word The word to check.
 * @return {Array} A two element array. The first element is the size of the
 *    word. The second element is the delimter used in the word.
 * @private
 */
goog.text.LoremIpsum.getWordInfo_ = function(word) {
  var ret;
  goog.array.some(goog.text.LoremIpsum.DELIMITERS_WORDS_,
      function (delimiter) {
        if (goog.string.endsWith(word, delimiter)) {
          ret = [word.length - delimiter.length, delimiter];
          return true;
        }
        return false;
      }
  );
  return ret || [word.length, ''];
};


/**
 * Constant used for {@link #randomNormal_}.
 * @type {number}
 * @private
 */
goog.text.LoremIpsum.NV_MAGICCONST_ = 4 * Math.exp(-0.5) / Math.sqrt(2.0);


/**
 * Generates a random number for a normal distribution with the specified
 * mean and sigma.
 * @param {number} mu The mean of the distribution.
 * @param {number} sigma The sigma of the distribution.
 * @private
 */
goog.text.LoremIpsum.randomNormal_ = function(mu, sigma) {
  while (true) {
    var u1 = Math.random();
    var u2 = 1.0 - Math.random();
    var z = goog.text.LoremIpsum.NV_MAGICCONST_ * (u1 - 0.5) / u2;
    var zz = z * z / 4.0;
    if (zz <= -Math.log(u2)) {
      break;
    }
  }
  return mu + z * sigma;
};


/**
 * Picks a random element of the array.
 * @param {Array} array The array to pick from.
 * @return {*} An element from the array.
 */
goog.text.LoremIpsum.randomChoice_ = function(array) {
  return array[goog.math.randomInt(array.length)];
};


/**
 * Dictionary of words for lorem ipsum.
 * @type {string}
 * @private
 */
goog.text.LoremIpsum.DICT_ =
    'a ac accumsan ad adipiscing aenean aliquam aliquet amet ante ' +
    'aptent arcu at auctor augue bibendum blandit class commodo ' +
    'condimentum congue consectetuer consequat conubia convallis cras ' +
    'cubilia cum curabitur curae cursus dapibus diam dictum dictumst ' +
    'dignissim dis dolor donec dui duis egestas eget eleifend elementum ' +
    'elit eni enim erat eros est et etiam eu euismod facilisi facilisis ' +
    'fames faucibus felis fermentum feugiat fringilla fusce gravida ' +
    'habitant habitasse hac hendrerit hymenaeos iaculis id imperdiet ' +
    'in inceptos integer interdum ipsum justo lacinia lacus laoreet ' +
    'lectus leo libero ligula litora lobortis lorem luctus maecenas ' +
    'magna magnis malesuada massa mattis mauris metus mi molestie ' +
    'mollis montes morbi mus nam nascetur natoque nec neque netus ' +
    'nibh nisi nisl non nonummy nostra nulla nullam nunc odio orci ' +
    'ornare parturient pede pellentesque penatibus per pharetra ' +
    'phasellus placerat platea porta porttitor posuere potenti praesent ' +
    'pretium primis proin pulvinar purus quam quis quisque rhoncus ' +
    'ridiculus risus rutrum sagittis sapien scelerisque sed sem semper ' +
    'senectus sit sociis sociosqu sodales sollicitudin suscipit ' +
    'suspendisse taciti tellus tempor tempus tincidunt torquent tortor ' +
    'tristique turpis ullamcorper ultrices ultricies urna ut varius ve ' +
    'vehicula vel velit venenatis vestibulum vitae vivamus viverra ' +
    'volutpat vulputate';


/**
 * A sample to use for generating the distribution of word and sentence lengths
 * in lorem ipsum.
 * @type {string}
 * @private
 */
goog.text.LoremIpsum.SAMPLE_ =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean ' +
    'commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus ' +
    'et magnis dis parturient montes, nascetur ridiculus mus. Donec quam ' +
    'felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla ' +
    'consequat massa quis enim. Donec pede justo, fringilla vel, aliquet ' +
    'nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, ' +
    'venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. ' +
    'Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean ' +
    'vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat ' +
    'vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra ' +
    'quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius ' +
    'laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel ' +
    'augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.\n\n' +

    'Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem ' +
    'quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam ' +
    'nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec ' +
    'odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis ' +
    'faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus ' +
    'tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales ' +
    'sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit ' +
    'cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend ' +
    'sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, ' +
    'metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis ' +
    'hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci ' +
    'luctus et ultrices posuere cubilia Curae; In ac dui quis mi ' +
    'consectetuer lacinia.\n\n' +

    'Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet ' +
    'nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ' +
    'ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent ' +
    'adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy ' +
    'metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros ' +
    'et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, ' +
    'nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit ' +
    'risus. Phasellus nec sem in justo pellentesque facilisis. Etiam ' +
    'imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus ' +
    'non, auctor et, hendrerit quis, nisi.\n\n' +

    'Curabitur ligula sapien, tincidunt non, euismod vitae, posuere ' +
    'imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed ' +
    'cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus ' +
    'accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci ' +
    'luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis ' +
    'porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis ' +
    'orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, ' +
    'bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede ' +
    'sit amet augue. In turpis. Pellentesque posuere. Praesent turpis.\n\n' +

    'Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu ' +
    'sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales ' +
    'nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse ' +
    'pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, ' +
    'nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in ' +
    'faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id ' +
    'purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum ' +
    'mollis diam. Pellentesque ut neque. Pellentesque habitant morbi ' +
    'tristique senectus et netus et malesuada fames ac turpis egestas.\n\n' +

    'In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac ' +
    'felis quis tortor malesuada pretium. Pellentesque auctor neque nec ' +
    'urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean ' +
    'viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et ' +
    'netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis ' +
    'pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna.\n\n' +

    'In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare ' +
    'lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ' +
    'ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. ' +
    'Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, ' +
    'quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at ' +
    'pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo ' +
    'quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam ' +
    'sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce ' +
    'risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis ' +
    'vulputate lorem.\n\n' +

    'Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, ' +
    'dui et placerat feugiat, eros pede varius nisi, condimentum viverra ' +
    'felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, ' +
    'varius ut, felis. In auctor lobortis lacus. Quisque libero metus, ' +
    'condimentum nec, tempor a, commodo mollis, magna. Vestibulum ' +
    'ullamcorper mauris at ligula. Fusce fermentum. Nullam cursus lacinia ' +
    'erat. Praesent blandit laoreet nibh.\n\n' +

    'Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas, ' +
    'neque sit amet convallis pulvinar, justo nulla eleifend augue, ac ' +
    'auctor orci leo non est. Quisque id mi. Ut tincidunt tincidunt erat. ' +
    'Etiam feugiat lorem non metus. Vestibulum dapibus nunc ac augue. ' +
    'Curabitur vestibulum aliquam leo. Praesent egestas neque eu enim. In ' +
    'hac habitasse platea dictumst. Fusce a quam. Etiam ut purus mattis ' +
    'mauris sodales aliquam. Curabitur nisi. Quisque malesuada placerat ' +
    'nisl. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, ' +
    'lacus.\n\n' +

    'Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, ' +
    'dui. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi ' +
    'congue nunc, vitae euismod ligula urna in dolor. Mauris sollicitudin ' +
    'fermentum libero. Praesent nonummy mi in odio. Nunc interdum lacus sit ' +
    'amet orci. Vestibulum rutrum, mi nec elementum vehicula, eros quam ' +
    'gravida nisl, id fringilla neque ante vel mi. Morbi mollis tellus ac ' +
    'sapien. Phasellus volutpat, metus eget egestas mollis, lacus lacus ' +
    'blandit dui, id egestas quam mauris ut lacus. Fusce vel dui. Sed in ' +
    'libero ut nibh placerat accumsan. Proin faucibus arcu quis ante. In ' +
    'consectetuer turpis ut velit. Nulla sit amet est. Praesent metus ' +
    'tellus, elementum eu, semper a, adipiscing nec, purus. Cras risus ' +
    'ipsum, faucibus ut, ullamcorper id, varius ac, leo. Suspendisse ' +
    'feugiat. Suspendisse enim turpis, dictum sed, iaculis a, condimentum ' +
    'nec, nisi. Praesent nec nisl a purus blandit viverra. Praesent ac ' +
    'massa at ligula laoreet iaculis. Nulla neque dolor, sagittis eget, ' +
    'iaculis quis, molestie non, velit.\n\n' +

    'Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. ' +
    'Fusce pharetra convallis urna. Quisque ut nisi. Donec mi odio, faucibus ' +
    'at, scelerisque quis, convallis in, nisi. Suspendisse non nisl sit amet ' +
    'velit hendrerit rutrum. Ut leo. Ut a nisl id ante tempus hendrerit. ' +
    'Proin pretium, leo ac pellentesque mollis, felis nunc ultrices eros, ' +
    'sed gravida augue augue mollis justo. Suspendisse eu ligula. Nulla ' +
    'facilisi. Donec id justo. Praesent porttitor, nulla vitae posuere ' +
    'iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum. ' +
    'Curabitur suscipit suscipit tellus.\n\n' +

    'Praesent vestibulum dapibus nibh. Etiam iaculis nunc ac metus. Ut id ' +
    'nisl quis enim dignissim sagittis. Etiam sollicitudin, ipsum eu ' +
    'pulvinar rutrum, tellus ipsum laoreet sapien, quis venenatis ante ' +
    'odio sit amet eros. Proin magna. Duis vel nibh at velit scelerisque ' +
    'suscipit. Curabitur turpis. Vestibulum suscipit nulla quis orci. Fusce ' +
    'ac felis sit amet ligula pharetra condimentum. Maecenas egestas arcu ' +
    'quis ligula mattis placerat. Duis lobortis massa imperdiet quam. ' +
    'Suspendisse potenti.\n\n' +

    'Pellentesque commodo eros a enim. Vestibulum turpis sem, aliquet eget, ' +
    'lobortis pellentesque, rutrum eu, nisl. Sed libero. Aliquam erat ' +
    'volutpat. Etiam vitae tortor. Morbi vestibulum volutpat enim. Aliquam ' +
    'eu nunc. Nunc sed turpis. Sed mollis, eros et ultrices tempus, mauris ' +
    'ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta ' +
    'dolor. Class aptent taciti sociosqu ad litora torquent per conubia ' +
    'nostra, per inceptos hymenaeos.\n\n' +

    'Pellentesque dapibus hendrerit tortor. Praesent egestas tristique nibh. ' +
    'Sed a libero. Cras varius. Donec vitae orci sed dolor rutrum auctor. ' +
    'Fusce egestas elit eget lorem. Suspendisse nisl elit, rhoncus eget, ' +
    'elementum ac, condimentum eget, diam. Nam at tortor in tellus interdum ' +
    'sagittis. Aliquam lobortis. Donec orci lectus, aliquam ut, faucibus ' +
    'non, euismod id, nulla. Curabitur blandit mollis lacus. Nam adipiscing. ' +
    'Vestibulum eu odio.\n\n' +

    'Vivamus laoreet. Nullam tincidunt adipiscing enim. Phasellus tempus. ' +
    'Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique ' +
    'sapien, a accumsan nisi mauris ac eros. Fusce neque. Suspendisse ' +
    'faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, ' +
    'vitae iaculis lacus elit id tortor. Vivamus aliquet elit ac nisl. Fusce ' +
    'fermentum odio nec arcu. Vivamus euismod mauris. In ut quam vitae ' +
    'odio lacinia tincidunt. Praesent ut ligula non mi varius sagittis. ' +
    'Cras sagittis. Praesent ac sem eget est egestas volutpat. Vivamus ' +
    'consectetuer hendrerit lacus. Cras non dolor. Vivamus in erat ut urna ' +
    'cursus vestibulum. Fusce commodo aliquam arcu. Nam commodo suscipit ' +
    'quam. Quisque id odio. Praesent venenatis metus at tortor pulvinar ' +
    'varius.\n\n';

/**
 * Sample that the generated text is based on .
 * @type {string}
 */
goog.text.LoremIpsum.prototype.sample_ = goog.text.LoremIpsum.SAMPLE_;


/**
 * Dictionary of words.
 * @type {string}
 */
goog.text.LoremIpsum.prototype.dictionary_ = goog.text.LoremIpsum.DICT_;
