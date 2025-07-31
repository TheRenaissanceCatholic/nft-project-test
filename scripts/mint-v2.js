// scripts/mint-v2.js
// This script mints an NFT from the NFTLandV2 contract (lower price for testing)

const hre = require("hardhat");

async function main() {
  // You'll need to replace this with the actual deployed address after deployment
  const contractAddress = "0x34DaA0C4e5f9455155a1039C168e407B3cC7c3B3";

  // Get the contract instance
  const NFTLandV2 = await hre.ethers.getContractFactory("NFTLandV2");
  const nftLandV2 = await NFTLandV2.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);
  
  // Check if fallback price is enabled
  const useFallbackPrice = await nftLandV2.useFallbackPrice();
  console.log("Using fallback price:", useFallbackPrice ? "Yes" : "No");
  
  // Check total supply
  try {
    const totalSupply = await nftLandV2.totalSupply();
    console.log("Current total supply:", totalSupply.toString());
  } catch (error) {
    console.log("Couldn't get total supply:", error.message);
  }
  
  // Get mint price
  try {
    const mintPrice = await nftLandV2.getMintPrice();
    console.log("Required ETH for minting:", hre.ethers.utils.formatEther(mintPrice), "ETH");
    
    // Add a small buffer (10%) to ensure the transaction goes through
    const buffer = mintPrice.mul(10).div(100);
    const totalETH = mintPrice.add(buffer);
    console.log("Sending amount (with 10% buffer):", hre.ethers.utils.formatEther(totalETH), "ETH");

    // Check wallet balance first
    const balance = await signer.getBalance();
    console.log("Your wallet balance:", hre.ethers.utils.formatEther(balance), "ETH");
    
    if (balance.lt(totalETH)) {
      console.log("You don't have enough ETH. Please get some testnet ETH from a faucet.");
      return;
    }

    // Call the mint function with the ETH amount
    try {
      console.log("Minting NFT...");
      const tx = await nftLandV2.mint({ value: totalETH });
      console.log("Mint transaction hash:", tx.hash);
      console.log("Waiting for transaction to be mined...");
      
      await tx.wait();
      console.log("Transaction mined! NFT minted successfully.");
      
      // Get the new total supply to know the token ID
      try {
        const newTotalSupply = await nftLandV2.totalSupply();
        console.log("Your newly minted token ID:", newTotalSupply.sub(1).toString());
        console.log("View on BaseScan:", `https://sepolia.basescan.org/token/${contractAddress}?a=${newTotalSupply.sub(1).toString()}`);
      } catch (error) {
        console.log("Couldn't get new total supply, but NFT was minted successfully.");
        console.log("Check your NFTs at:", `https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
      }
    } catch (error) {
      console.error("Error minting NFT:", error.message);
    }
  } catch (error) {
    console.error("Error getting mint price:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 