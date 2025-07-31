// scripts/check-nfts-v2.js
// This script checks NFT ownership for the V2 contract

const hre = require("hardhat");

async function main() {
  // Deployed NFTLandV2 contract address on Base Sepolia
  const contractAddress = "0x34DaA0C4e5f9455155a1039C168e407B3cC7c3B3";

  // Get the contract instance
  const NFTLandV2 = await hre.ethers.getContractFactory("NFTLandV2");
  const nftLandV2 = await NFTLandV2.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);

  // Check contract details
  try {
    const totalSupply = await nftLandV2.totalSupply();
    console.log("Total NFTs minted:", totalSupply.toString());
    
    const reservedMinted = await nftLandV2.reservedMinted();
    console.log("Reserved NFTs minted:", reservedMinted.toString());
    
    // Check USD price
    const usdPrice = await nftLandV2.USD_PRICE();
    console.log("USD price:", hre.ethers.utils.formatEther(usdPrice));
    
    // Check if using fallback price
    const useFallback = await nftLandV2.useFallbackPrice();
    console.log("Using fallback price:", useFallback);
    
    // Check fallback ETH price (which has 8 decimals like Chainlink)
    const fallbackPrice = await nftLandV2.fallbackEthPrice();
    console.log("Fallback ETH price:", fallbackPrice.toString() / 1e8, "USD");
    
    // Try to get the mint price
    try {
      const mintPrice = await nftLandV2.getMintPrice();
      console.log("Current mint price:", hre.ethers.utils.formatEther(mintPrice), "ETH");
    } catch (error) {
      console.log("Could not get mint price:", error.message);
    }
  } catch (error) {
    console.error("Error checking contract details:", error.message);
  }
  
  // Check NFTs owned by the user
  try {
    const balance = await nftLandV2.balanceOf(signer.address);
    console.log("\nYour NFT balance:", balance.toString());
    
    if (balance.gt(0)) {
      console.log("\nYour NFT IDs:");
      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await nftLandV2.tokenOfOwnerByIndex(signer.address, i);
          console.log(`NFT #${tokenId.toString()}`);
        } catch (error) {
          console.log(`Error getting NFT #${i+1}:`, error.message);
        }
      }
      
      console.log("\nView your NFTs on BaseScan:");
      console.log(`https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
    } else {
      console.log("You don't own any NFTs from this contract yet.");
    }
  } catch (error) {
    console.error("Error checking NFT ownership:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 