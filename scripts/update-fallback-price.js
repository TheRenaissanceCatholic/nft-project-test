// scripts/update-fallback-price.js
// This script updates the fallback ETH price to achieve a mint price of approximately 0.001 ETH

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
  
  // Check owner
  try {
    const owner = await nftLandV2.owner();
    console.log("Contract owner:", owner);
    
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      console.log("Error: You are not the owner of this contract!");
      console.log("Only the owner can update the fallback price.");
      return;
    }
  } catch (error) {
    console.error("Error checking owner:", error.message);
    return;
  }
  
  // Check current status
  const currentFallbackPrice = await nftLandV2.fallbackEthPrice();
  console.log("Current fallback ETH price: $", currentFallbackPrice.toString() / 1e8);
  
  const usdPrice = await nftLandV2.USD_PRICE();
  console.log("USD price per NFT: $", hre.ethers.utils.formatEther(usdPrice));
  
  const useFallback = await nftLandV2.useFallbackPrice();
  console.log("Using fallback price:", useFallback);
  
  // Calculate the required ETH price to achieve a mint price of 0.001 ETH
  // Formula: ETH_PRICE = USD_PRICE / MINT_PRICE
  // Where ETH_PRICE is in USD/ETH (with 8 decimals)
  // USD_PRICE is in USD (with 18 decimals)
  // MINT_PRICE is the target mint price (0.001 ETH)
  
  const targetMintPrice = hre.ethers.utils.parseEther("0.001");
  console.log("Target mint price:", hre.ethers.utils.formatEther(targetMintPrice), "ETH");
  
  // USD_PRICE / MINT_PRICE = ETH_PRICE (in USD)
  // For 8 decimal places: ETH_PRICE * 10^8
  const newEthPrice = usdPrice.mul(1e8).div(targetMintPrice);
  console.log("Required fallback ETH price: $", newEthPrice.toString() / 1e8);
  
  // Make sure fallback price is enabled
  if (!useFallback) {
    console.log("Enabling fallback price...");
    try {
      const toggleTx = await nftLandV2.toggleFallbackPrice({
        gasLimit: 200000
      });
      console.log("Transaction hash:", toggleTx.hash);
      console.log("Waiting for transaction to be mined...");
      
      await toggleTx.wait();
      console.log("Fallback price has been enabled!");
    } catch (error) {
      console.error("Error enabling fallback price:", error.message);
      return;
    }
  }
  
  // Set the new fallback price
  try {
    console.log("Setting new fallback ETH price...");
    const tx = await nftLandV2.setFallbackEthPrice(newEthPrice, {
      gasLimit: 200000
    });
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! Fallback ETH price has been updated.");
    
    // Check the actual mint price now
    try {
      const mintPrice = await nftLandV2.getMintPrice();
      console.log("New mint price:", hre.ethers.utils.formatEther(mintPrice), "ETH");
      if (mintPrice.lt(targetMintPrice.mul(2)) && mintPrice.gt(targetMintPrice.div(2))) {
        console.log("✅ Mint price is now approximately 0.001 ETH");
      } else {
        console.log("⚠️ Mint price is not as expected, might need adjustment");
      }
    } catch (error) {
      console.error("Error checking new mint price:", error.message);
    }
  } catch (error) {
    console.error("Error setting fallback price:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 