# 🏗 NFTY-VILLAGE Scaffold-ETH

> everything you need to build on Ethereum! 🚀


DEMO LINK: https://nextjs-eth-typescript-react-starter-kit.vercel.app/


- [Next.js](https://nextjs.org)
- [Typescript](https://www.typescriptlang.org/)
- [Hardhat](https://hardhat.org/)
- [TypeChain](https://github.com/ethereum-ts/TypeChain)
- [Ethers.js](https://docs.ethers.io/v5/)
- [useDApp](https://usedapp.io/)
- [Chakra UI](https://chakra-ui.com/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)

# 🏄‍♂️ Quick Start

clone project:

```bash
git clone https://github.com/protokol/nextjs-eth-typescript-react-starter-kit
cd nextjs-eth-typescript-react-starter-kit

yarn install

# Start up the Hardhat Network
yarn chain
```

Here we just install the npm project's dependencies, and by running `yarn chain` we spin up an instance of Hardhat Network that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
yarn deploy
```

This will deploy the contract to Hardhat Network. After this completes run:

```bash
yarn dev
```

This will start up the Next.js development server and your site will be available at http://localhost:3000/


# Compile and deploy contracts

Important to now:

yarn compile generates ABI and TS bindings to work with smart contracts from the frontend. The folders that are generated are in frontend:

- artifacts
- types

Typechain generates TS bindings - so much easier to work with contracts.

```bash
yarn compile
yarn deploy # if local network is running
yarn deploy:rinkeby # if you want to deploy to rinkeby test network
```

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`

📝 Edit your frontend in `packages/frontend/pages/index.tsx`

💼 Edit your deployment scripts in `packages/hardhat/scripts/deploy`

📱 Open http://localhost:3000 to see the app

