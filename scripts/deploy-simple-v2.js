// scripts/deploy-simple-v2.js
// This script deploys the NFTLandSimpleV2 contract (0.001 ETH mint price, IDs start at 1)

const hre = require("hardhat");

async function main() {
  // Set your baseTokenURI - replace with your actual metadata URL
  const baseTokenURI = "https://nft-land-metadata.vercel.app/api/";

  console.log("Deploying NFTLandSimpleV2 contract with fixed mint price...");
  console.log("Using base token URI:", baseTokenURI);
  console.log("Fixed mint price: 0.001 ETH");
  console.log("Token IDs will start from 1");

  // Get the ContractFactory
  const NFTLandSimpleV2 = await hre.ethers.getContractFactory("NFTLandSimpleV2");

  // Deploy the contract
  console.log("Deploying...");
  const nftLandSimpleV2 = await NFTLandSimpleV2.deploy(baseTokenURI);

  // Wait for deployment to finish
  await nftLandSimpleV2.deployed();

  console.log("NFTLandSimpleV2 deployed to:", nftLandSimpleV2.address);
  console.log("----------------------------------");
  console.log("To verify on BaseScan, run:");
  console.log(`npx hardhat verify --network baseSepolia ${nftLandSimpleV2.address} "${baseTokenURI}"`);
  console.log("----------------------------------");
  console.log("To mint an NFT (costs exactly 0.001 ETH), run:");
  console.log(`npx hardhat run scripts/mint-simple-v2.js --network baseSepolia`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 