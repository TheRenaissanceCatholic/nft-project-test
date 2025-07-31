// scripts/deploy-v2.js
// This script deploys the NFTLandV2 contract to Base Sepolia (lower price for testing)

const hre = require("hardhat");

async function main() {
  // Set your baseTokenURI - replace with your actual metadata URL
  const baseTokenURI = "https://nft-land-metadata.vercel.app/api/";

  // Chainlink ETH/USD price feed address for Base Sepolia
  const priceFeedAddress = "0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2"; // ETH/USD on Base Sepolia

  console.log("Deploying NFTLandV2 contract to Base Sepolia...");
  console.log("Using base token URI:", baseTokenURI);
  console.log("Using price feed address:", priceFeedAddress);

  // Get the ContractFactory
  const NFTLandV2 = await hre.ethers.getContractFactory("NFTLandV2");

  // Deploy the contract
  console.log("Deploying...");
  const nftLandV2 = await NFTLandV2.deploy(baseTokenURI, priceFeedAddress);

  // Wait for deployment to finish
  await nftLandV2.deployed();

  console.log("NFTLandV2 deployed to:", nftLandV2.address);
  console.log("----------------------------------");
  console.log("Lower price: $10 USD per NFT (instead of $1000)");
  console.log("----------------------------------");
  console.log("To verify on Basescan, run:");
  console.log(`npx hardhat verify --network baseSepolia ${nftLandV2.address} "${baseTokenURI}" ${priceFeedAddress}`);
  
  // Enable fallback price for easier testing
  console.log("----------------------------------");
  console.log("Enabling fallback price for easier testing...");
  
  const tx = await nftLandV2.toggleFallbackPrice();
  await tx.wait();
  
  console.log("Fallback price enabled! Now calculating mint price...");
  const mintPrice = await nftLandV2.getMintPrice();
  console.log("Current mint price:", hre.ethers.utils.formatEther(mintPrice), "ETH");
  console.log("----------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 