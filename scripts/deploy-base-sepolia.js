// scripts/deploy-base-sepolia.js
// This script deploys the NFTLand contract to the Base Sepolia testnet

const hre = require("hardhat");

async function main() {
  // Set your baseTokenURI - replace with your actual metadata URL
  const baseTokenURI = "https://nft-land-metadata.vercel.app/api/";

  // Chainlink ETH/USD price feed address for Base Sepolia
  // Using Base Sepolia ETH/USD price feed from Chainlink
  // Source: https://docs.chain.link/data-feeds/price-feeds/addresses?network=base#sepolia-testnet
  const priceFeedAddress = "0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2"; // ETH/USD on Base Sepolia

  console.log("Deploying NFTLand contract to Base Sepolia...");
  console.log("Using base token URI:", baseTokenURI);
  console.log("Using price feed address:", priceFeedAddress);

  // Get the ContractFactory
  const NFTLand = await hre.ethers.getContractFactory("NFTLand");

  // Deploy the contract
  console.log("Deploying...");
  const nftLand = await NFTLand.deploy(baseTokenURI, priceFeedAddress);

  // Wait for deployment to finish
  await nftLand.deployed();

  console.log("NFTLand deployed to:", nftLand.address);
  console.log("----------------------------------");
  console.log("To verify on Basescan, run:");
  console.log(`npx hardhat verify --network baseSepolia ${nftLand.address} "${baseTokenURI}" ${priceFeedAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 