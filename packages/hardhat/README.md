![Img](header.png)

# TypeScript Solidity Boilerplate Starter Kit

A BoilerPlate Template Project To Start Solidity Development With Hardhat and Typescript. All you have to do is create a new repository from the template and start coding your smartcontracts. 

## Hardhat Configuration

- typescript support enabled
- typechain plugin installed (typescript type bindings are generated from smart contracts)/check Typechain docs
- hardhat-deploy plugin enabled (use deployments from `deploy` folder, order and tag them; multi-network)
- hardhat console enabled - to allow console.log usage within solidity code
- testing environment configured and operational

Check the Hardhat documentation for more information. 

https://hardhat.org/getting-started/


We recommend installing `hh autocomplete` so you can use `hh` shorthand globally.

`npm i -g hardhat-shorthand`

https://hardhat.org/guides/shorthand.html

## Usage

Run `npm install` and then:

- `hh compile` - to compile smart contract and generate typechain ts bindings
- `hh test` - to run tests
- `hh deploy` - to deploy to local network (see options for more)
- `hh TABTAB` - to use autocomplete
- `hh node` - to run a localhost node


Check `package.json` scripts for more options.
Use `.env.example` file and adapt it to you values and settings.

Have Fun!

## Nfty Village contract development instructions

To build on top of Nfty Contracts we will have to deploy them. We will do this on 
Rinkeby testnet and then we will verify the contract so it will be possible to interact
with it on Etherscan.

The environment file example is name `.env.example`, you can check what variables are
needed there or you can just follow this guide in which I will tell you what to setup.

### Installation 

```sh
npm i -g hardhat-shorthand
npm install
hh compile
```

To execute tests 
```sh
hh test
```

### General Setup 

#### 1. RPC provider
I recommend you to use [Alchemy API](https://www.alchemy.com/) 

```dosini
RINKEBY_RPC_URL=https://eth-rinkeby.alchemyapi.io/v2/<API-KEY>
```

#### 2. Mnemonic
You can export you mnemonic from MetaMask

```dosini
MNEMONIC=your-mnemonic-passphrase
```

#### 3. Etherscan API
Setup [Etherscan API](https://etherscan.io/) key so you will be able to verify your contract, this will enable 
you to interact with smart contract via Etherscan.

```dosini
ETHERSCAN_API_KEY=<YOUR-KEY>
```

### Deploying Nfty Pass

To deploy Nfty Pass we will set default base uri which the contract will have

```dosini
NFTY_PASS_BASE_URL=www.placeholder.com/
```

#### Deployment

First argument is Contract address that was deployed and the second one is base url
that was used in deployment.
```sh
hh deploy --tags pass --network rinkeby

hh verify <CONTRACT-ADDRESS> "www.placeholder.com/" --network rinkeby
```

The ABI json file which is needed by the GUI to interact with smart contract is located
at `./abi/contracts/NftyPass/NftyPass.json`

### Deploying Nfty Halloween set
To deploy Halloween set we will have set NftyPass Contract Address and base url

```dosini
NFTY_HALLOWEEN_BASE_URL=www.placeholder2.com/
NFTY_HALLOWEEN_NFTY_PASS_ADDRESS=0xbe715eBA71324CE2277144D09aFe678c881B6615
```

First argument is contract address.

Second argument is `NFTY_HALLOWEEN_BASE_URL`

Third argument is `NFTY_HALLOWEEN_NFTY_PASS_ADDRESS`
```sh
hh deploy --tags halloween --network rinkeby

hh verify <CONTRACT-ADDRESS> "www.placeholder2.com/" "0xbe715eBA71324CE2277144D09aFe678c881B6615" --network rinkeby
```

ABI json file is located at `./abi/contracts/NftyHalloween/NftyHalloween.json`

