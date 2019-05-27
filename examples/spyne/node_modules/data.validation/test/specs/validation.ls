# # Specification for Validation

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

spec = (require 'hifive')!
Validation = require '../../lib'
{for-all, data: {Any:BigAny, Int}, sized} = require 'claire'
{ok, throws} = require 'assert'

{Success, Failure} = Validation

Any = sized (-> 10), BigAny
k   = (a, b) --> a

isnt3 = (a, b, c) -> a !== b and b !== c

module.exports = spec 'Validation' (o, spec) ->

  spec 'Constructors' (o) ->
    o 'Failure' do
       for-all(Any).satisfy (a) ->
         Failure(a).is-failure and not Failure(a).is-success
       .as-test!
    o 'Success' do
       for-all(Any).satisfy (a) ->
         Success(a).is-success and not Success(a).is-failure
       .as-test!
    o 'from-nullable' do
       for-all(Any).satisfy (a) ->
         | a? => Validation.from-nullable(a).is-success
         | _  => Validation.from-nullable(a).is-failure
       .classify (a) ->
         | a? => 'Not null'
         | _  => 'Null'
       .as-test!

  o 'of should always return a Success' do
     for-all(Any).satisfy (a) ->
       Validation.of(a).is-equal Success(a)
     .as-test!

  spec 'ap(b)' (o) ->
    o 'Applying a success to a failure should propagate the failure' do
       for-all(Any, Any, Any).given(isnt3) .satisfy (a, b, c) ->
         Success(k b).ap(Failure c).is-equal Failure(c)
       .as-test!

    o 'Applying a failure to a success should propagate the failure' do
       for-all(Any, Any, Any).given(isnt3) .satisfy (a, b, c) ->
         Failure(c).ap(Success(k b)).is-equal Failure(c)
       .as-test!

    o 'Applying a success A to a success B should map the success B' do
       for-all(Int) .satisfy (a) ->
         Success((+ 1)).ap(Success(a)).is-equal Success(a + 1)
       .as-test!

    o 'Applying a failure to another failure should aggregate w/ semigroup' do
       for-all(Any, Any).given (!==) .satisfy (a, b) ->
         Failure([a]).ap(Failure([b])).swap!get! === [a, b]
       .as-test!

  o 'map(f) should keep Failures unchanged' do
     for-all(Any).satisfy (a) ->
       Failure(a).map((_) -> [a,a]).is-equal Failure(a)
     .as-test!

  spec 'to-string()' (o) ->
    o 'Success' do
       for-all(Int).satisfy (a) ->
         Success(a).to-string! is "Validation.Success(#a)"
       .as-test!
    o 'Failure' do
       for-all(Int).satisfy (a) ->
         Failure(a).to-string! is "Validation.Failure(#a)"
       .as-test!

  spec 'is-equal(b)' (o) ->
    o 'Successs are always equivalent to Successs, but not Failures' do
       for-all(Any).satisfy (a) ->
         Success(a).is-equal(Success(a)) and not Success(a).is-equal(Failure(a))
       .as-test!
    o 'Successs are never equal Successs with different values' do
       for-all(Any, Any).given (!==) .satisfy (a, b) ->
         not Success(a).is-equal(Success(b))
       .as-test!

  spec 'get()' (o) ->
    o 'For rights should return the value.' do
       for-all(Any).satisfy (a) ->
         Success(a).get! is a
       .as-test!
    o 'For lefts should throw a type error' do
       for-all(Any).satisfy (a) ->
         throws (-> Failure(a).get!), TypeError
         true
       .as-test!

  spec 'get-or-else(a)' (o) ->
    o 'For rights should return the value.' do
       for-all(Any, Any).satisfy (a, b) ->
         Success(a).get-or-else(b) is a
       .as-test!
    o 'For lefts should return the alternative.' do
       for-all(Any, Any).satisfy (a, b) ->
         Failure(a).get-or-else(b) is b
       .as-test!

  spec 'or-else(f)' (o) ->
    o 'For rights should return itself' do
       for-all(Any, Any).satisfy (a, b) ->
         Success(a).or-else((-> Failure(b))).is-equal Success(a)
       .as-test!
    o 'For lefts should return the Validation f returns' do
       for-all(Any, Any).given (!==) .satisfy (a, b) ->
         Failure(a).or-else((-> Success(b))).is-equal Success(b)
       .as-test!

  o 'merge() should return any value' do
     for-all(Any).satisfy (a) ->
       Success(a).merge! is Failure(a).merge!
     .as-test!

  spec 'fold(f, g)' (o) ->
    o 'For lefts, should call f' do
       for-all(Any, Any, Any).given (!==) .satisfy (a, b, c) ->
         Failure(a).fold(k Success(b); k Failure(c)).is-equal Success(b)
       .as-test!
    o 'For rights, should call g' do
       for-all(Any, Any, Any).given (!==) .satisfy (a, b, c) ->
         Success(a).fold(k Success(b); k Failure(c)).is-equal Failure(c)
       .as-test!

  o 'swap()' do
     for-all(Any).satisfy (a) ->
       Success(a).swap!is-equal(Failure(a)) and Failure(a).swap!is-equal(Success(a))
     .as-test!

  spec 'bimap(f, g)' (o) ->
    o 'For lefts should return a new left mapped by f' do
       for-all(Any, Any, Any)
       .given ((a, b, c) -> a !== b and b !== c)
       .satisfy (a, b, c) ->
         Failure(a).bimap(k b; k c).is-equal Failure(b)
       .as-test!
    o 'For rights should return a new right mapped by f' do
       for-all(Any, Any, Any)
       .given ((a, b, c) -> a !== c and b !== c)
       .satisfy (a, b, c) ->
         Success(a).bimap(k b; k c).is-equal Success(c)
       .as-test!

  spec 'failure-map(f)' (o) ->
    o 'For failures should return a new failure mapped by f' do
       for-all(Any, Any).given (!==) .satisfy (a, b) ->
         Failure(a).failure-map(k b).is-equal Failure(b)
       .as-test!
    o 'For successes should return itself' do
       for-all(Any, Any).given (!==) .satisfy (a, b) ->
         Success(a).failure-map(k b).is-equal Success(a)
       .as-test!

  spec 'left-map(f)' (o) ->
    o 'For lefts should return a new left mapped by f' do
       for-all(Any, Any).given (!==) .satisfy (a, b) ->
         Failure(a).left-map(k b).is-equal Failure(b)
       .as-test!
    o 'For rights should return itself' do
       for-all(Any, Any).given (!==) .satisfy (a, b) ->
         Success(a).left-map(k b).is-equal Success(a)
       .as-test!

  spec 'cata(p)' (o) ->
    o 'For failures, should apply the Failure tag' do
       for-all(Any).satisfy (a) ->
         Failure(a).cata(Failure: ((x) -> [x, x]), Success: ((x) -> [x])) === [a, a]
       .as-test!
    o 'For successes, should apply the Success tag' do
       for-all(Any).satisfy (a) ->
         Success(a).cata(Failure: ((x) -> [x, x]), Success: ((x) -> [x])) === [a]
       .as-test!
