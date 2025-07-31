// scripts/set-mint-price-v2.js
// This script updates the fallback ETH price to achieve a mint price of exactly 0.001 ETH

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // Deployed NFTLandV2 contract address on Base Sepolia
  const contractAddress = "0xBAA227b1e70FC14C63B1084b852F5DdD29f77E6d";

  // Get the contract instance
  const NFTLandV2 = await ethers.getContractFactory("NFTLandV2");
  const nftLandV2 = await NFTLandV2.attach(contractAddress);

  // Get the signer's address
  const [signer] = await ethers.getSigners();
  console.log("Your address:", signer.address);
  
  // Check if user is the owner
  const owner = await nftLandV2.owner();
  console.log("Contract owner:", owner);
  
  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    console.log("Error: You are not the owner of this contract!");
    console.log("Only the owner can update the fallback price.");
    return;
  }
  
  // Check current status
  const currentFallbackPrice = await nftLandV2.fallbackEthPrice();
  console.log("Current fallback ETH price: $", currentFallbackPrice.toString() / 1e8);
  
  const usdPrice = await nftLandV2.USD_PRICE();
  console.log("USD price per NFT: $", ethers.utils.formatEther(usdPrice));
  
  const useFallback = await nftLandV2.useFallbackPrice();
  console.log("Using fallback price:", useFallback);
  
  // First make sure fallback price is enabled
  if (!useFallback) {
    console.log("Enabling fallback price...");
    try {
      const toggleTx = await nftLandV2.toggleFallbackPrice({
        gasLimit: 200000
      });
      console.log("Transaction hash:", toggleTx.hash);
      await toggleTx.wait();
      console.log("Fallback price has been enabled!");
    } catch (error) {
      console.error("Error enabling fallback price:", error.message);
      return;
    }
  }
  
  // Calculate required ETH price based on the mint formula in the contract
  // In the contract: requiredETH = (USD_PRICE * 1e18) / ethPrice / 1e8
  // We want requiredETH to be 0.001 ETH, so:
  // ethPrice = (USD_PRICE * 1e18) / (0.001 * 1e18) / 1e8
  
  const targetMintPrice = ethers.utils.parseEther("0.001");
  console.log("Target mint price:", ethers.utils.formatEther(targetMintPrice), "ETH");
  
  // The calculation: 
  // ethPrice = (USD_PRICE * 1e18) / targetMintPrice / 1e8
  const numerator = usdPrice.mul(ethers.BigNumber.from(10).pow(18));
  const denominator = targetMintPrice.mul(ethers.BigNumber.from(10).pow(8));
  const newEthPrice = numerator.div(denominator);
  
  console.log("Setting fallback ETH price to:", newEthPrice.toString());
  
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
    const mintPrice = await nftLandV2.getMintPrice();
    console.log("New mint price:", ethers.utils.formatEther(mintPrice), "ETH");
    
    if (mintPrice.eq(targetMintPrice)) {
      console.log("✅ Success! Mint price is exactly 0.001 ETH");
    } else {
      console.log("⚠️ Mint price is close but not exactly 0.001 ETH due to rounding");
      console.log("Difference:", ethers.utils.formatEther(mintPrice.sub(targetMintPrice)), "ETH");
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