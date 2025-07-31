// scripts/deploy.js
// This script deploys the NFTLand contract to the Sepolia testnet

const { ethers } = require("hardhat");

async function main() {
  // Set your baseTokenURI (replace with your IPFS or video metadata link)
  const baseTokenURI = "https://your-ipfs-or-server-link/metadata.json";

  // Chainlink ETH/USD price feed address for Sepolia
  // Source: https://docs.chain.link/data-feeds/price-feeds/addresses
  const priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

  // Get the contract factory
  const NFTLand = await ethers.getContractFactory("NFTLand");

  // Deploy the contract
  const contract = await NFTLand.deploy(baseTokenURI, priceFeedAddress);
  await contract.deployed();

  console.log("NFTLand deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 