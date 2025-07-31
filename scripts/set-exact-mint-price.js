// scripts/set-exact-mint-price.js
// This script sets the mint price to exactly 0.001 ETH by calculating the precise fallback price

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
    return;
  }
  
  // Get contract details
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
      await toggleTx.wait();
      console.log("Fallback price has been enabled!");
    } catch (error) {
      console.error("Error enabling fallback price:", error.message);
      return;
    }
  }
  
  // Target mint price: 0.001 ETH
  const targetMintPrice = ethers.utils.parseEther("0.001");
  console.log("Target mint price:", ethers.utils.formatEther(targetMintPrice), "ETH");
  
  // Looking at the contract code, the mint price is calculated as:
  // requiredETH = (USD_PRICE * 1e18) / ethPrice / 1e8
  
  // So to get a specific mint price, we need:
  // ethPrice = (USD_PRICE * 1e18) / (targetMintPrice * 1e8)
  
  // USD_PRICE is 10 * 1e18 (from the contract)
  // targetMintPrice is 0.001 * 1e18
  // We want the result in 8 decimal places for Chainlink format
  
  // Calculate the price with full precision
  const newEthPrice = usdPrice.mul(ethers.BigNumber.from(10).pow(18)).div(targetMintPrice.mul(ethers.BigNumber.from(10).pow(8)));
  console.log("New fallback ETH price:", newEthPrice.toString());
  
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
    
    // Verify the mint price
    const mintPrice = await nftLandV2.getMintPrice();
    console.log("New mint price:", ethers.utils.formatEther(mintPrice), "ETH");
    
    // Let's try a different approach - set a much higher ETH price
    if (Math.abs(parseFloat(ethers.utils.formatEther(mintPrice)) - 0.001) > 0.0001) {
      console.log("Mint price is still not close enough to 0.001 ETH");
      console.log("Trying a different approach with a much higher ETH price...");
      
      // Set a very high ETH price - $10,000,000 per ETH
      // This will make the mint price very small
      const highEthPrice = ethers.BigNumber.from("1000000000000"); // $10M with 8 decimals
      
      const tx2 = await nftLandV2.setFallbackEthPrice(highEthPrice, {
        gasLimit: 200000
      });
      console.log("Transaction hash:", tx2.hash);
      console.log("Waiting for transaction to be mined...");
      
      await tx2.wait();
      console.log("Transaction mined! Fallback ETH price has been updated to a very high value.");
      
      // Check the mint price again
      const newMintPrice = await nftLandV2.getMintPrice();
      console.log("Updated mint price:", ethers.utils.formatEther(newMintPrice), "ETH");
      
      if (parseFloat(ethers.utils.formatEther(newMintPrice)) <= 0.001) {
        console.log("✅ Success! Mint price is now less than or equal to 0.001 ETH");
      } else {
        console.log("⚠️ Still not at target price. Manual adjustment needed.");
      }
    } else {
      console.log("✅ Success! Mint price is approximately 0.001 ETH");
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