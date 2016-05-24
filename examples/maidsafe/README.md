# MaidSAFE • [TodoMVC](http://todomvc.com)

[![Build Status](https://travis-ci.org/Zatvobor/todomvc.svg?branch=master)](https://travis-ci.org/Zatvobor/todomvc)

> The New Decentralized Internet

## Resources

- [Website](http://maidsafe.net)
- [Documentation](https://maidsafe.readme.io)
- [Blog](http://blog.maidsafe.net)

### In a nutshell

The main purpose of this app is to provide a complete example of MAID application
development routine. This app promotes things like:

- [x] React, Redux and Redux-Thunk conveniences.
- [x] compile JS and CSS through `electron-compile`.
- [x] testing through `electron-mocha`. Tests are running in `renderer` process.
- [x] using Fetch API to interface a `safe_launcher` (ships with mocks in specs).
- [ ] communication to `safe_launcher` over dedicated thread.
- [x] application authorizing with confirmation whether the obtained token is still valid.
- [x] store todo list into safe network.
- [ ] package app into a `asar` archive and release as OSX package (PGP signed).

### Installation and usage

You have to go through `npm install`, `npm test` and finally `npm start`. Tada! You did it.

### Wait, seriously?

Yeah. Make sure you have installed a `safe_launcher` (configured with `use-mock-routing` feature). Here is a link to [Quick start](https://github.com/maidsafe/safe_launcher#quick-start).

### Support

Let us [know](https://github.com/zatvobor/todomvc/issues) if you discover anything worth sharing.

*Some MAIDs/BTC would be helpful: [1DUr1QLqgaa8erpEk5Ucc8Jqs926Y7mpqh](https://blockchain.info/address/1DUr1QLqgaa8erpEk5Ucc8Jqs926Y7mpqh)*

## Credits

This app is heavily based on available [redux's example](https://github.com/reactjs/redux/tree/master/examples/todomvc).

## License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br />This <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" rel="dct:type">work</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://zatvobor.github.io" property="cc:attributionName" rel="cc:attributionURL">Aleksey Zatvobor</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US">Creative Commons Attribution 4.0 International License</a>.
