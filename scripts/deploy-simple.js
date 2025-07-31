// scripts/deploy-simple.js
// This script deploys the simplified NFTLandSimple contract (0.001 ETH mint price)

const hre = require("hardhat");

async function main() {
  // Set your baseTokenURI - replace with your actual metadata URL
  const baseTokenURI = "https://nft-land-metadata.vercel.app/api/";

  console.log("Deploying NFTLandSimple contract with fixed mint price...");
  console.log("Using base token URI:", baseTokenURI);
  console.log("Fixed mint price: 0.001 ETH");

  // Get the ContractFactory
  const NFTLandSimple = await hre.ethers.getContractFactory("NFTLandSimple");

  // Deploy the contract
  console.log("Deploying...");
  const nftLandSimple = await NFTLandSimple.deploy(baseTokenURI);

  // Wait for deployment to finish
  await nftLandSimple.deployed();

  console.log("NFTLandSimple deployed to:", nftLandSimple.address);
  console.log("----------------------------------");
  console.log("To verify on BaseScan, run:");
  console.log(`npx hardhat verify --network baseSepolia ${nftLandSimple.address} "${baseTokenURI}"`);
  console.log("----------------------------------");
  console.log("To mint an NFT (costs exactly 0.001 ETH), run:");
  console.log(`npx hardhat run scripts/mint-simple.js --network baseSepolia`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 