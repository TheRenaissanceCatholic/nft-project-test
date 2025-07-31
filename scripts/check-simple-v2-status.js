// scripts/check-simple-v2-status.js
// This script checks the status of the NFTLandSimpleV2 contract

const hre = require("hardhat");

async function main() {
  // Contract address from the most recent deployment
  const contractAddress = "0xcEB376FDB26F7CBbe5fEE41e70aE7939EA369C6a";

  // Get the contract instance
  const NFTLandSimpleV2 = await hre.ethers.getContractFactory("NFTLandSimpleV2");
  const nftLandSimpleV2 = await NFTLandSimpleV2.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);

  console.log("\n=== NFTLandSimpleV2 Contract Status ===");
  console.log("Contract address:", contractAddress);
  
  try {
    // Check contract details
    const totalSupply = await nftLandSimpleV2.totalSupply();
    console.log("Total NFTs minted:", totalSupply.toString());
    
    const maxSupply = await nftLandSimpleV2.MAX_SUPPLY();
    console.log("Maximum supply:", maxSupply.toString());
    
    const mintPrice = await nftLandSimpleV2.MINT_PRICE();
    console.log("Mint price:", hre.ethers.utils.formatEther(mintPrice), "ETH");
    
    // Note: baseTokenURI is private, so we can't read it directly
    console.log("Base token URI: Private (set during deployment)");
    
    // Check NFTs owned by the user
    const balance = await nftLandSimpleV2.balanceOf(signer.address);
    console.log("\n=== Your NFT Holdings ===");
    console.log("Number of NFTs owned:", balance.toString());
    
    if (balance.gt(0)) {
      console.log("\nYour NFT IDs:");
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftLandSimpleV2.tokenOfOwnerByIndex(signer.address, i);
        console.log(`NFT #${tokenId.toString()}`);
      }
      
      console.log("\nView your NFTs on BaseScan:");
      console.log(`https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
    } else {
      console.log("You don't own any NFTs from this contract yet.");
    }
    
    // Check wallet ETH balance
    const ethBalance = await signer.getBalance();
    console.log("\n=== Your Wallet ===");
    console.log("ETH balance:", hre.ethers.utils.formatEther(ethBalance), "ETH");
    if (ethBalance.lt(mintPrice)) {
      console.log("⚠️ You don't have enough ETH to mint an NFT");
    } else {
      console.log("✅ You have enough ETH to mint an NFT");
    }
    
  } catch (error) {
    console.error("Error checking contract details:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 