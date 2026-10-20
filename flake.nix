{
  description = "wanten.org (TanStack Start + pnpm) dev environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSystem = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forEachSystem (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs_24
              pnpm_10
            ];

            shellHook = ''
              echo "node $(node --version), pnpm $(pnpm --version)"
              echo "run 'pnpm install' first, then 'pnpm dev'"
            '';
          };
        }
      );
    };
}
