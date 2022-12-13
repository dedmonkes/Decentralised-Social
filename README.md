# Decentalised Social Programs

## Overview 

A collection of programs that enable an open social network.


| Progam Name                                   | Rust Crate | npm Package |
| ---------------------------------------|------------|-------------|
| [Identifiers Program](./programs/identifiers) |N/A  |      N/A    |
| [Leaf Program](./programs/leaf) |N/A  |      N/A    |
| [Profiles Program](./programs/profiles) |N/A  |      N/A    |
| [Align Program](./programs/align-governance) |N/A  |      N/A    |
| [Multigraph Program](./programs/multigraph) |N/A  |      N/A    |


| Client name                                   | Rust Crate | npm Package |
| ---------------------------------------|------------|-------------|
| [Align SDK](./programs/sdk) |N/A  |     align-sdk |
| [Align Webapp](./programs/leaf) |N/A  |      N/A    |


## How to run

To run the demo webapp you must run the test suite in detach mode to start a local validator with some populated data.

Import your keypair from ~/.config/solana/id.json into your wallet of choice we find solflare to work nicely with the dev enviroment.

Our metadata for proposals uses shadow drive so you will need a small amout of Mainnet SOL and shadow upload the data. a couple of dollars worth should be suffcient

Two .env files are needed one in the 'app' directory and other at root

//Root directory
```bash
    SHADOW_RPC_URL=YOUR_MAINNET_RPC_URL
```

//App directory
```bash
    REACT_APP_SOL_RPC=http://localhost:8899
    REACT_APP_SHADOW_RPC=YOUR_MAINNET_RPC_URL
    SHDW_BROWSER=true
```

Run the follow commands to get everything

### run the validator
```bash
    git clone git@github.com:dedmonkes/Decentralised-Social.git
    cd sdk
    yarn insatll
    cd ..
    yarn install
    anchor test --detach

```

### run webapp
```bash
    npm i
    npm start
```
