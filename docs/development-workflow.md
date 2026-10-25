
# Development Workflow

## Prerequisites

- Ubuntu on WSL
- Git
- Node.js LTS and npm
- VS Code with WSL support
- Foundry: Forge, Cast, and Anvil
- A browser wallet for local/testnet development

## Clone the Repository

git clone https://github.com/srkarthekasai/BlockPerp.git
cd blockperp

## Frontend Setup

cd frontend
npm install
npm run dev

Use the local URL printed by Next.js.

## Contract Setup

cd contracts
forge build
forge test
forge fmt --check
npm run lint

## Local Blockchain

In a separate Ubuntu terminal:

cd ~/blockperp/contracts
anvil

Use only Anvil's generated development accounts and keys
for local testing. Never use those keys with real funds.

## Git Workflow

1. Pull the latest changes before starting.
2. Create a feature branch.
3. Implement a focused change.
4. Run relevant tests and checks.
5. Inspect the Git diff.
6. Commit and push the feature branch.
7. Open a pull request and review the changes.

Example:

git switch -c feat/dashboard-routes
git status
git diff
git add frontend docs
git commit -m "feat(frontend): add dashboard route structure"
git push -u origin feat/dashboard-routes

## Secrets

Copy .env.example to .env and populate only the values needed
for your environment. Never commit .env or expose private keys.

## Dependency Management

Keep package-lock.json for npm dependencies and commit it.
Keep Foundry dependency references and remappings consistent.
Review dependency changes before upgrading pinned versions.
