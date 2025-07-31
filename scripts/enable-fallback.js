// scripts/enable-fallback.js
// This script enables the fallback price on the NFTLandV2 contract

const hre = require("hardhat");

async function main() {
  // Deployed NFTLandV2 contract address on Base Sepolia
  const contractAddress = "0xBAA227b1e70FC14C63B1084b852F5DdD29f77E6d";

  // Get the contract instance
  const NFTLandV2 = await hre.ethers.getContractFactory("NFTLandV2");
  const nftLandV2 = await NFTLandV2.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);
  
  // Check current fallback status
  const currentStatus = await nftLandV2.useFallbackPrice();
  console.log("Current fallback price enabled:", currentStatus);
  
  // Check owner
  try {
    const owner = await nftLandV2.owner();
    console.log("Contract owner:", owner);
    
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      console.log("Warning: You are not the owner of this contract!");
      console.log("Only the owner can enable fallback pricing.");
      return;
    }
  } catch (error) {
    console.error("Error checking owner:", error.message);
    return;
  }
  
  // Toggle fallback price
  try {
    console.log("Enabling fallback price...");
    const tx = await nftLandV2.toggleFallbackPrice();
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! Fallback price has been toggled.");
    
    // Check new status
    const newStatus = await nftLandV2.useFallbackPrice();
    console.log("New fallback price enabled:", newStatus);
    
    // Check mint price
    const mintPrice = await nftLandV2.getMintPrice();
    console.log("Current mint price:", hre.ethers.utils.formatEther(mintPrice), "ETH");
  } catch (error) {
    console.error("Error enabling fallback price:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 