#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR/contracts"

echo "== Solidity formatting =="
forge fmt --check

echo "== Solidity build =="
forge build

echo "== Solidity tests =="
forge test

echo "== Solidity lint =="
npm run lint

echo "All contract checks passed."
