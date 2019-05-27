# # Specification for the algebraic laws

/** ^
 * Copyright (c) 2013 Quildreen Motta
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

# Before we define the specification, we need to set up the specs
# libraries, and grab a hold of our data structure and the laws we want
# to verify.
spec = (require 'hifive')!
laws = require 'laws'
Validation = require '../../lib/'

# And to use the laws, we need to provide a constructor function, that
# given a single argument will return a new data structure containing
# that argument. We also make sure that the constructor for our
# semigroup implementation lifts the value into a non empty list, so we
# can concatenate the values.
make = (a) -> Validation.Success a

# Then we provide the specification for the test runner. As we're using
# Hifive here, it expects that each definition for the specification to
# have a function that will throw exceptions on failures. We use the
# `asTest` property from Claire that returns exactly what Hifive (and
# Mocha & other testing libraries) expect.
module.exports = spec 'Algebraic laws' (o, spec) ->
 
  spec ': Functor' (o) ->
    o '1. Identity'     laws.functor.identity(make).as-test!
    o '2. Composition'  laws.functor.composition(make).as-test!

  spec ': Applicative' (o) ->
    o '1. Identity'     laws.applicative.identity(make).as-test!
    o '2. Composition'  laws.applicative.composition(make).as-test!
    o '3. Homomorphism' laws.applicative.homomorphism(make).as-test!
    o '4. Interchange'  laws.applicative.interchange(make).as-test!
