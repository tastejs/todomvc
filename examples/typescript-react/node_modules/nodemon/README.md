<p align="center">
  <img src="https://user-images.githubusercontent.com/13700/35731649-652807e8-080e-11e8-88fd-1b2f6d553b2d.png" alt="Nodemon Logo">
</p>

# nodemon

nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

nodemon does **not** require *any* additional changes to your code or method of development. nodemon is a replacement wrapper for `node`. To use `nodemon`, replace the word `node` on the command line when executing your script.

[![NPM version](https://badge.fury.io/js/nodemon.svg)](https://npmjs.org/package/nodemon)
[![Travis Status](https://travis-ci.org/remy/nodemon.svg?branch=master)](https://travis-ci.org/remy/nodemon) [![Backers on Open Collective](https://opencollective.com/nodemon/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/nodemon/sponsors/badge.svg)](#sponsors)

# Installation

Either through cloning with git or by using [npm](http://npmjs.org) (the recommended way):

```bash
npm install -g nodemon # or using yarn: yarn global add nodemon
```

And nodemon will be installed globally to your system path.

You can also install nodemon as a development dependency:

```bash
npm install --save-dev nodemon # or using yarn: yarn add nodemon -D
```

With a local installation, nodemon will not be available in your system path or you can't use it directly from the command line. Instead, the local installation of nodemon can be run by calling it from within an npm script (such as `npm start`) or using `npx nodemon`.

# Usage

nodemon wraps your application, so you can pass all the arguments you would normally pass to your app:

```bash
nodemon [your node app]
```

For CLI options, use the `-h` (or `--help`) argument:

```bash
nodemon -h
```

Using nodemon is simple, if my application accepted a host and port as the arguments, I would start it as so:

```bash
nodemon ./server.js localhost 8080
```

Any output from this script is prefixed with `[nodemon]`, otherwise all output from your application, errors included, will be echoed out as expected.

You can also pass the `inspect` flag to node through the command line as you would normally:

```bash
nodemon --inspect ./server.js 80
```

If you have a `package.json` file for your app, you can omit the main script entirely and nodemon will read the `package.json` for the `main` property and use that value as the app ([ref](https://github.com/remy/nodemon/issues/14)).

nodemon will also search for the `scripts.start` property in `package.json` (as of nodemon 1.1.x).

Also check out the [FAQ](https://github.com/remy/nodemon/blob/master/faq.md) or [issues](https://github.com/remy/nodemon/issues) for nodemon.

## Automatic re-running

nodemon was originally written to restart hanging processes such as web servers, but now supports apps that cleanly exit. If your script exits cleanly, nodemon will continue to monitor the directory (or directories) and restart the script if there are any changes.

## Manual restarting

Whilst nodemon is running, if you need to manually restart your application, instead of stopping and restart nodemon, you can type `rs` with a carriage return, and nodemon will restart your process.

## Config files

nodemon supports local and global configuration files. These are usually named `nodemon.json` and can be located in the current working directory or in your home directory. An alternative local configuration file can be specified with the `--config <file>` option.

The specificity is as follows, so that a command line argument will always override the config file settings:

- command line arguments
- local config
- global config

A config file can take any of the command line arguments as JSON key values, for example:

```json
{
  "verbose": true,
  "ignore": ["*.test.js", "fixtures/*"],
  "execMap": {
    "rb": "ruby",
    "pde": "processing --sketch={{pwd}} --run"
  }
}
```

The above `nodemon.json` file might be my global config so that I have support for ruby files and processing files, and I can run `nodemon demo.pde` and nodemon will automatically know how to run the script even though out of the box support for processing scripts.

A further example of options can be seen in [sample-nodemon.md](https://github.com/remy/nodemon/blob/master/doc/sample-nodemon.md)

### package.json

If you want to keep all your package configurations in one place, nodemon supports using `package.json` for configuration.
Specify the config in the same format as you would for a config file but under `nodemonConfig` in the `package.json` file, for example, take the following `package.json`:

```json
{
  "name": "nodemon",
  "homepage": "http://nodemon.io",
  "...": "... other standard package.json values",
  "nodemonConfig": {
    "ignore": ["test/*", "docs/*"],
    "delay": 2500
  }
}
```

Note that if you specify a `--config` file or provide a local `nodemon.json` any `package.json` config is ignored.

*This section needs better documentation, but for now you can also see `nodemon --help config` ([also here](https://github.com/remy/nodemon/blob/master/doc/cli/config.txt))*.

## Using nodemon as a module

Please see [doc/requireable.md](doc/requireable.md)

## Using nodemon as child process

Please see [doc/events.md](doc/events.md#Using_nodemon_as_child_process)

## Running non-node scripts

nodemon can also be used to execute and monitor other programs. nodemon will read the file extension of the script being run and monitor that extension instead of `.js` if there's no `nodemon.json`:

```bash
nodemon --exec "python -v" ./app.py
```

Now nodemon will run `app.py` with python in verbose mode (note that if you're not passing args to the exec program, you don't need the quotes), and look for new or modified files with the `.py` extension.

### Default executables

Using the `nodemon.json` config file, you can define your own default executables using the `execMap` property. This is particularly useful if you're working with a language that isn't supported by default by nodemon.

To add support for nodemon to know about the `.pl` extension (for Perl), the `nodemon.json` file would add:

```json
{
  "execMap": {
    "pl": "perl"
  }
}
```

Now running the following, nodemon will know to use `perl` as the executable:

```bash
nodemon script.pl
```

It's generally recommended to use the global `nodemon.json` to add your own `execMap` options. However, if there's a common default that's missing, this can be merged in to the project so that nodemon supports it by default, by changing [default.js](https://github.com/remy/nodemon/blob/master/lib/config/defaults.js) and sending a pull request.

## Monitoring multiple directories

By default nodemon monitors the current working directory. If you want to take control of that option, use the `--watch` option to add specific paths:

```bash
nodemon --watch app --watch libs app/server.js
```

Now nodemon will only restart if there are changes in the `./app` or `./libs` directory. By default nodemon will traverse sub-directories, so there's no need in explicitly including sub-directories.

Don't use unix globbing to pass multiple directories, e.g `--watch ./lib/*`, it won't work. You need a `--watch` flag per directory watched.

## Specifying extension watch list

By default, nodemon looks for files with the `.js`, `.mjs`, `.coffee`, `.litcoffee`, and `.json` extensions. If you use the `--exec` option and monitor `app.py` nodemon will monitor files with the extension of `.py`. However, you can specify your own list with the `-e` (or `--ext`) switch like so:

```bash
nodemon -e js,pug
```

Now nodemon will restart on any changes to files in the directory (or subdirectories) with the extensions `.js`, `.pug`.

## Ignoring files

By default, nodemon will only restart when a `.js` JavaScript file changes. In some cases you will want to ignore some specific files, directories or file patterns, to prevent nodemon from prematurely restarting your application.

This can be done via the command line:

```bash
nodemon --ignore lib/ --ignore tests/
```

Or specific files can be ignored:

```bash
nodemon --ignore lib/app.js
```

Patterns can also be ignored (but be sure to quote the arguments):

```bash
nodemon --ignore 'lib/*.js'
```

Note that by default, nodemon will ignore the `.git`, `node_modules`, `bower_components`, `.nyc_output`, `coverage` and `.sass-cache` directories and *add* your ignored patterns to the list. If you want to indeed watch a directory like `node_modules`, you need to [override the underlying default ignore rules](https://github.com/remy/nodemon/blob/master/faq.md#overriding-the-underlying-default-ignore-rules).

## Application isn't restarting

In some networked environments (such as a container running nodemon reading across a mounted drive), you will need to use the `legacyWatch: true` which enables Chokidar's polling.

Via the CLI, use either `--legacy-watch` or `-L` for short:

```bash
nodemon -L
```

Though this should be a last resort as it will poll every file it can find.

## Delaying restarting

In some situations, you may want to wait until a number of files have changed. The timeout before checking for new file changes is 1 second. If you're uploading a number of files and it's taking some number of seconds, this could cause your app to restart multiple times unnecessarily.

To add an extra throttle, or delay restarting, use the `--delay` command:

```bash
nodemon --delay 10 server.js
```

For more precision, milliseconds can be specified.  Either as a float:

```bash
nodemon --delay 2.5 server.js
```

Or using the time specifier (ms):

```bash
nodemon --delay 2500ms server.js
```

The delay figure is number of seconds (or milliseconds, if specified) to delay before restarting. So nodemon will only restart your app the given number of seconds after the *last* file change.

If you are setting this value in `nodemon.json`, the value will always be interpreted in milliseconds. E.g., the following are equivalent:

```bash
nodemon --delay 2.5

{
  "delay": 2500
}
```

## Gracefully reloading down your script

It is possible to have nodemon send any signal that you specify to your application.

```bash
nodemon --signal SIGHUP server.js
```

Your application can handle the signal as follows.

```js
process.once("SIGHUP", function () {
  reloadSomeConfiguration();
})
```

Please note that nodemon will send this signal to every process in the process tree.

If you are using `cluster`, then each workers (as well as the master) will receive the signal. If you wish to terminate all workers on receiving a `SIGHUP`, a common pattern is to catch the `SIGHUP` in the master, and forward `SIGTERM` to all workers, while ensuring that all workers ignore `SIGHUP`.

```js
if (cluster.isMaster) {
  process.on("SIGHUP", function () {
    for (const worker of Object.values(cluster.workers)) {
      worker.process.kill("SIGTERM");
    }
  });
} else {
  process.on("SIGHUP", function() {})
}
```

## Controlling shutdown of your script

nodemon sends a kill signal to your application when it sees a file update. If you need to clean up on shutdown inside your script you can capture the kill signal and handle it yourself.

The following example will listen once for the `SIGUSR2` signal (used by nodemon to restart), run the clean up process and then kill itself for nodemon to continue control:

```js
process.once('SIGUSR2', function () {
  gracefulShutdown(function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});
```

Note that the `process.kill` is *only* called once your shutdown jobs are complete. Hat tip to [Benjie Gillam](http://www.benjiegillam.com/2011/08/node-js-clean-restart-and-faster-development-with-nodemon/) for writing this technique up.

## Triggering events when nodemon state changes

If you want growl like notifications when nodemon restarts or to trigger an action when an event happens, then you can either `require` nodemon or add event actions to your `nodemon.json` file.

For example, to trigger a notification on a Mac when nodemon restarts, `nodemon.json` looks like this:

```json
{
  "events": {
    "restart": "osascript -e 'display notification \"app restarted\" with title \"nodemon\"'"
  }
}
```

A full list of available events is listed on the [event states wiki](https://github.com/remy/nodemon/wiki/Events#states). Note that you can bind to both states and messages.

## Pipe output to somewhere else

```js
nodemon({
  script: ...,
  stdout: false // important: this tells nodemon not to output to console
}).on('readable', function() { // the `readable` event indicates that data is ready to pick up
  this.stdout.pipe(fs.createWriteStream('output.txt'));
  this.stderr.pipe(fs.createWriteStream('err.txt'));
});
```

## Using nodemon in your gulp workflow

Check out the [gulp-nodemon](https://github.com/JacksonGariety/gulp-nodemon) plugin to integrate nodemon with the rest of your project's gulp workflow.

## Using nodemon in your Grunt workflow

Check out the [grunt-nodemon](https://github.com/ChrisWren/grunt-nodemon) plugin to integrate nodemon with the rest of your project's grunt workflow.

## Pronunciation

> nodemon, is it pronounced: node-mon, no-demon or node-e-mon (like pokémon)?

Well...I've been asked this many times before. I like that I've been asked this before. There's been bets as to which one it actually is.

The answer is simple, but possibly frustrating. I'm not saying (how I pronounce it). It's up to you to call it as you like. All answers are correct :)

## Design principles

- Fewer flags is better
- Works across all platforms
- Fewer features
- Let individuals build on top of nodemon
- Offer all CLI functionality as an API
- Contributions must have and pass tests

Nodemon is not perfect, and CLI arguments has sprawled beyond where I'm completely happy, but perhaps it can be reduced a little one day.

## FAQ

See the [FAQ](https://github.com/remy/nodemon/blob/master/faq.md) and please add your own questions if you think they would help others.

## Backers

Thank you to all [our backers](https://opencollective.com/nodemon#backer)! 🙏

[![nodemon backers](https://opencollective.com/nodemon/backers.svg?width=890)](https://opencollective.com/nodemon#backers)

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [Sponsor this project today ❤️](https://opencollective.com/nodemon#sponsor)

<!-- generated with https://jqterm.com/8d123effeb793313c2a0ad559adbc6a4?query=def%20getImage%3A%0A%09.%20as%20%24_%20%7C%0A%09%7B%20%0A%20%20%20%20%20%20%22206432%22%3A%20%22https%3A%2F%2Fuser-images.githubusercontent.com%2F13700%2F127474039-8ba5ac8c-2095-4984-9309-54ff15e95340.png%22%2C%0A%09%20%20%22215800%22%3A%20%22https%3A%2F%2Fimages.opencollective.com%2Faussielowdepositcasino%2Fd85338f%2Flogo%2F256.png%22%20%0A%20%20%20%20%7D%20%7C%20%28.%5B%22%5C%28%24_.MemberId%29%22%5D%20%2F%2F%20%24_.image%29%0A%3B%0A%0Adef%20tohtml%3A%0A%09%22%3Ca%20href%3D%27%5C%28.website%29%27%3E%3Cimg%20src%3D%27%5C%28.%20%7C%20getImage%29%27%20style%3D%27object-fit%3A%20contain%3B%20float%3A%20left%3B%20margin%3A12px%27%20height%3D%27120%27%20width%3D%27120%27%3E%3C%2Fa%3E%22%0A%3B%0A%0Asort_by%28.createdAt%29%20%7C%20map%28select%28.isActive%20%3D%3D%20true%20and%20.image%29%20%7C%20tohtml%29%20%7C%20join%28%22%22%29&raw=true -->
<div style="overflow: hidden; margin-bottom: 80px;">
<a href='https://www.topratedcasinosites.co.uk/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/2c1d1cb0-623b-11eb-a737-2bef0291120b.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://najlepsibukmacherzy.pl/ranking-legalnych-bukmacherow/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/52acecf0-608a-11eb-b17f-5bca7c67fe7b.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://topaussiecasinos.com/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/89ea5890-6d1c-11ea-9dd9-330b3b2faf8b.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://netticasinohex.com/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/b802aa50-7b1a-11ea-bcaf-0dc68ad9bc17.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://kasynohex.com/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/2bb0d6e0-99c8-11ea-9349-199aa0d5d24a.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://hollandsegokken.nl/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/3af13c90-8b43-11eb-9237-593e900cd7df.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.casinoonlineaams.com'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/a0694620-b88f-11eb-b3a4-b97529e4b911.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://slotokingua.com'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/3c173eb0-96b7-11eb-84a7-571f6970ac83.jpg' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://gamblizardcanada.com/free-spins/'><img src='https://logo.clearbit.com/gamblizardcanada.com' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://anbefaltcasino.com/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/9d50eb20-eb92-11ea-bffe-c532c6ce425f.jpg' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.bitcoinbuster.com/'><img src='https://logo.clearbit.com/bitcoinbuster.com' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://casinosters.com/minimum-deposit-casinos/'><img src='https://user-images.githubusercontent.com/13700/127474039-8ba5ac8c-2095-4984-9309-54ff15e95340.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.casinotopp.net/sv/'><img src='https://logo.clearbit.com/casinotopp.net' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.casinoutanlicens.io/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/52f13c30-0d78-11eb-88e4-510439e2a88d.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://casinowhizz.com'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/23256a80-f5c1-11eb-99f7-fbf8e4d6c6be.jpg' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://aussielowdepositcasino.com/'><img src='https://images.opencollective.com/aussielowdepositcasino/d85338f/logo/256.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.casinot.net'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/73b4fc10-7591-11ea-a1d4-01a20d893b4f.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.parhaatkasinot.com'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/4dfc1820-b6ee-11ea-9fa9-e39f53823609.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.cryptosnacks.org/bitcoin-casino/'><img src='https://opencollective-production.s3.us-west-1.amazonaws.com/db217a90-122f-11ec-81e8-594bc2daa9dc.png' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.kasinot.fi'><img src='https://logo.clearbit.com/www.kasinot.fi' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://betomania.pl/ranking-bukmacherow/'><img src='https://logo.clearbit.com/betomania.pl' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a><a href='https://www.targetedwebtraffic.com'><img src='https://logo.clearbit.com/targetedwebtraffic.com' style='object-fit: contain; float: left; margin:12px' height='120' width='120'></a>

</div>

# License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
