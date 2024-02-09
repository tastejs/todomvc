# Js_of_ocaml TodoMVC Example

> Js_of_ocaml is a compiler of OCaml bytecode to Javascript.

## Resources

- [Website](http://ocsigen.org/js_of_ocaml/)
- [GitHub](https://github.com/ocsigen/js_of_ocaml)
- [Try Js_of_ocaml](http://try.ocamlpro.com/)

## Support

Js_of_ocaml is part of [Ocsigen project](http://ocsigen.org/).

- [Discuss](https://discuss.ocaml.org/)
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

  - Then install the OCaml compiler if needed. For instance, to install OCaml 4.12.0:

    ```sh
    > opam switch create 4.12.0
    > eval `opam config env`
    ```

  - Check that the current compiler is now OCaml 4.12.0:

    ```sh
    > opam switch
    #  switch   compiler                    description
    →  4.12.0   ocaml-base-compiler.4.12.0  4.12.0
       default  ocaml-system.4.05.0         default
    ```

    The right arrow shows the current OCaml compiler. 


  - Let's now install Js_of_ocaml and all the required dependencies:

    ```sh
    > opam install ocamlbuild js_of_ocaml ocamlfind deriving js_of_ocaml-ppx ppx_deriving js_of_ocaml-ppx_deriving_json tyxml js_of_ocaml-tyxml lwt_ppx js_of_ocaml-lwt
    ```

  - To be sure to have the latest version of every dependencies you can ask to `opam` to upgrade the packages if needed:

    ```sh
    > opam update
    > opam upgrade
    ````

  Congratulations, you now have all the required packages! We can now build the application.

2. Compile the `todomvc.ml` file to OCaml bytecode with the `ocamlbuild` command:

  ```sh
  > ocamlbuild -use-ocamlfind \
	-pkgs lwt_ppx,js_of_ocaml-lwt,js_of_ocaml-ppx,js_of_ocaml-tyxml,tyxml,js_of_ocaml.deriving,js_of_ocaml-ppx_deriving_json,deriving \
	todomvc.byte ;
  ```

  The command options are:
  - `-use-ocamlfind` and `-pkgs ...` to use the necessary `ocamlfind` packages.

3. Build the Javascript file from the `todomvc.byte` file with the `js_of_ocaml` command:

  ```sh
  > js_of_ocaml --opt 3 -o js/todomvc.js todomvc.byte
  ```

  The command options are:
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
