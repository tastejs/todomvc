.PHONY= update build optim

all: clean update build optim

update:
	wasm32-wasi-cabal update

build:
	wasm32-wasi-cabal build 
	$(eval my_wasm=$(shell wasm32-wasi-cabal list-bin app | tail -n 1))
	$(shell wasm32-wasi-ghc --print-libdir)/post-link.mjs --input $(my_wasm) --output ghc_wasm_jsffi.js
	cp -v $(my_wasm)* .

optim:
	wasm-opt -all -O2 app.wasm -o app.wasm
	wasm-tools strip -o app.wasm app.wasm

serve:
	http-server .

clean:
	rm -rf dist-newstyle public
