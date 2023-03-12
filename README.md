# Swap tokens

Swap WETH for UNI using ethers and hardhat mainnet fork

#### 1. Install dependencies

First you need to install project dependencies by running this command:

```shell
npm install
```

#### 2. Add your Alchemy or Infura URL mainnet as an environment variable for the project

Create an empty `.env` file in the base directory of this project.

Add the following line to the `.env` file replacing `YOUR_ALCHEMY_URL_MAINNET` with your url.

```sh
ALCHEMY_URL_MAINNET=YOUR_ALCHEMY_URL_MAINNET
```

#### 2. Run hardhat node

Run hardhat node using this command:

```shell
npx hardhat node
```

#### 3. Execute the swap

In another terminal, run this command to execute the swap

```shell
 node unsiwapTrader.js
```
