# Js_of_ocaml TodoMVC Example

> Js_of_ocaml is a compiler of OCaml bytecode to Javascript.

## Resources

- [Website](http://ocsigen.org/js_of_ocaml/)
- [GitHub](https://github.com/ocsigen/js_of_ocaml)
- [Try Js_of_ocaml](http://try.ocamlpro.com/js_of_ocaml/)

## Support

Js_of_ocaml is part of [Ocsigen project](http://ocsigen.org/).

- [Mailing list](https://sympa.inria.fr/sympa/subscribe/ocsigen)
- IRC : #ocsigen on irc.freenode.net


## Implementation

Open `index.html` in your browser to try the application.

If you want to build the application on your own:

1. Install Js_of_ocaml and the required dependencies. An easy way is to use [opam](https://opam.ocaml.org/). After having installed `opam`, follow these steps:

  - If you use `opam` for the first time, you have to initialize it:

    ```sh
    > opam init
    > eval `opam config env`
    ```

    This will create a `.opam` directory in your home.

  - You need a very recent version of OCaml compiler. First check the current version used by `opam`:

    ```sh
    > opam switch
    --     -- 3.11.2  Official 3.11.2 release
    --     -- 3.12.1  Official 3.12.1 release
    --     -- 4.00.0  Official 4.00.0 release
    --     -- 4.00.1  Official 4.00.1 release
    --     -- 4.01.0  Official 4.01.0 release
    --     -- 4.02.0  Official 4.02.0 release
    --     -- 4.02.1  Official 4.02.1 release
    --     -- 4.02.2  Official 4.02.2 release
    system  C system  System compiler (4.02.1)
    ```

    The `C` letter shows the current compiler. Here it's a 4.02.1 version installed at a system level (ie in `/usr/local/bin/` for instance). We can see that a more recent version is available (4.02.2). So we will install it with `opam switch 4.02.2`. This won't remove the system compiler as `opam` will install the files in your `.opam` directory.

    ```sh
    > opam switch 4.02.2
    > eval `opam config env`
    ```

    You can use again `opam switch` to check that the current compiler is now OCaml 4.02.2:

    ```sh
    > opam switch
    --     -- 3.11.2  Official 3.11.2 release
    --     -- 3.12.1  Official 3.12.1 release
    --     -- 4.00.0  Official 4.00.0 release
    --     -- 4.00.1  Official 4.00.1 release
    --     -- 4.01.0  Official 4.01.0 release
    --     -- 4.02.0  Official 4.02.0 release
    --     -- 4.02.1  Official 4.02.1 release
    4.02.2  C 4.02.2  Official 4.02.2 release
    system  I system  System compiler (4.02.1)
    ```

  - Let's now install Js_of_ocaml and all the required dependencies. As Js_of_ocaml is a part of a larger project named Eliom, we will simply install this package:

    ```sh
    > opam install eliom
    ```

  - The final and important step is to be sure to have the latest version of Eliom and its dependencies. So ask to `opam` to upgrade the packages if needed:

    ```sh
    > opam update
    > opam upgrade
    ````

  Congratulations, you now have all the required packages! We can now build the application.

2. Compile the `todomvc.ml` file to OCaml bytecode with the `ocamlbuild` command:

  ```sh
  > ocamlbuild -use-ocamlfind \
	-tags "warn(-40)" \
	-pkgs lwt.syntax,js_of_ocaml,js_of_ocaml.syntax,js_of_ocaml.tyxml,tyxml,js_of_ocaml.deriving,js_of_ocaml.deriving.syntax,deriving \
	-syntax camlp4o \
	todomvc.byte ;
  ```

  The command options are:
  - `-use-ocamlfind` and `-pkgs ...` to use the necessary `ocamlfind` packages.
  - `-tags "warn(-40)"` to avoid harmless warnings about constructor or label name used out of scope.
  - `-syntax camlp4o` for the syntax extension support.
3. Build the Javascript file from the `todomvc.byte` file with the `js_of_ocaml` command:

  ```sh
  > js_of_ocaml +weak.js --opt 3 -o js/todomvc.js todomvc.byte
  ```

  The command options are:
  - `+weak.js` to include the necessary `weak` package.
  - `--opt 3` to set optimization profile.
  - `-o js/todomvc.js` to set output file name.

Please note that for the second and third step, you can also use the `build.sh` script:

```sh
> /bin/sh build.sh
```

## Credit

Created by [Stéphane Legrand](https://github.com/slegrand45).

Various code improvements from [Gabriel Radanne](https://github.com/Drup).

Based on Elm implementation by [Evan Czaplicki](https://github.com/evancz).
