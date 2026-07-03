{ pkgs ? import <nixpkgs> { } }:
let
in pkgs.mkShell {
  packages = [
		pkgs.nodejs
		pkgs.typescript
		pkgs.typescript-language-server
		pkgs.vitejs
		pkgs.cloudflared
  ];
}
