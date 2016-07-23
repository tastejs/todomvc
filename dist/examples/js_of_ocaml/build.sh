#!/bin/sh

# Compile OCaml source file to OCaml bytecode
ocamlbuild -use-ocamlfind \
	-tags "warn(-40)" \
	-pkgs lwt.syntax,js_of_ocaml,js_of_ocaml.syntax,js_of_ocaml.tyxml,tyxml,js_of_ocaml.deriving,js_of_ocaml.deriving.syntax,deriving \
	-syntax camlp4o \
	todomvc.byte ;

# Build JS code from the OCaml bytecode
js_of_ocaml +weak.js --opt 3 -o js/todomvc.js todomvc.byte
