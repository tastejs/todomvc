#!/bin/sh

# Compile OCaml source file to OCaml bytecode
ocamlbuild -use-ocamlfind \
	-pkgs lwt_ppx,js_of_ocaml-lwt,js_of_ocaml-ppx,js_of_ocaml-tyxml,tyxml,js_of_ocaml.deriving,js_of_ocaml-ppx_deriving_json,deriving \
	todomvc.byte ;

# Build JS code from the OCaml bytecode
js_of_ocaml --opt 3 -o js/todomvc.js todomvc.byte
