{

  inputs = {
    miso.url = "github:dmjio/miso";
  };

  outputs = inputs:
    inputs.miso.inputs.flake-utils.lib.eachDefaultSystem (system: {
      devShells = {
        default = inputs.miso.outputs.devShells.${system}.default;
        wasm = inputs.miso.outputs.devShells.${system}.wasm;
        ghcjs = inputs.miso.outputs.devShells.${system}.ghcjs;
      };
    });
}
