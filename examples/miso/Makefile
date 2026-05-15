.PHONY= update build

all: clean update build optim

update:
	cabal update --with-ghc=javascript-unknown-ghcjs-ghc --with-hc-pkg=javascript-unknown-ghcjs-ghc-pkg

build:
	cabal build --with-ghc=javascript-unknown-ghcjs-ghc --with-hc-pkg=javascript-unknown-ghcjs-ghc-pkg
	cp -v ./dist-newstyle/build/javascript-ghcjs/ghc-9.12.2/miso-todomvc-0.1/x/app/build/app/app.jsexe/all.js .

optim:
	bunx swc ./all.js -o out.js

serve:
	http-server .

clean:
	cabal clean
