const { network, ethers } = require("hardhat");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");

const {
  abi: ISwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
const { getPoolImmutables } = require("./helpers");
const ERC20ABI = require("./ERC20ABI.json");

const WALLET_ADDRESS = "0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9";

// hardhat node
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
const poolAddress = "0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801"; // UNI/WETH
const swapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

const name1 = "Uniswap";
const symbol1 = "UNI";
const decimals1 = 18;
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

async function main() {
  //pool contract
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
  );

  //get pool info
  const immutables = await getPoolImmutables(poolContract);

  //swap router contract
  const swapRouterContract = new ethers.Contract(
    swapRouter,
    ISwapRouterABI,
    provider
  );

  //amount to swap
  const amountIn = ethers.utils.parseEther("1");

  // WETH contract
  const token0Contract = new ethers.Contract(address0, ERC20ABI, provider);

  // impersonate Account how has WETH in mainnet
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [WALLET_ADDRESS],
  });

  // get the signer of the wallet address
  const signer = await ethers.getSigner(WALLET_ADDRESS);

  // approve to router swap contract to take controll of 1 the amountIn
  await token0Contract.connect(signer).approve(swapRouter, amountIn);

  // param for swap
  const params = {
    tokenIn: immutables.token1,
    tokenOut: immutables.token0,
    fee: immutables.fee,
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000),
    amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  // uniswap contract
  const token1Contract = new ethers.Contract(address1, ERC20ABI, provider);

  // get balance of WETH before swap
  const balance0Before = ethers.utils.formatEther(
    await token0Contract.balanceOf(WALLET_ADDRESS)
  );

  // get balance of UNI before swap
  const balance1Before = ethers.utils.formatEther(
    await token1Contract.balanceOf(WALLET_ADDRESS)
  );

  // swap tokens using swap router contract
  await swapRouterContract.connect(signer).exactInputSingle(params, {
    gasLimit: ethers.utils.hexlify(1000000),
  });

  // get balance of WETH after swap
  const balance0After = ethers.utils.formatEther(
    await token0Contract.balanceOf(WALLET_ADDRESS)
  );

  // get balance of UNI after swap
  const balance1After = ethers.utils.formatEther(
    await token1Contract.balanceOf(WALLET_ADDRESS)
  );

  console.log(
    `Before trade => ${symbol0}: ${balance0Before}, ${symbol1}: ${balance1Before}`
  );

  console.log(
    `After trade => ${symbol0}: ${balance0After}, ${symbol1}: ${balance1After}`
  );
}

main();
