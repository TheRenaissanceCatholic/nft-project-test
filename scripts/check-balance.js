// scripts/check-balance.js
// This script checks wallet balance and NFTs

const hre = require("hardhat");

async function main() {
  // Contract address that was deployed on Base Sepolia
  const contractAddress = "0x57F458a41d4248569dA4E8bE7405230E178d5562";

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);
  
  // Check wallet ETH balance
  const balance = await signer.getBalance();
  console.log("ETH balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  if (parseFloat(hre.ethers.utils.formatEther(balance)) < 0.5) {
    console.log("\n⚠️ Not enough ETH to mint. You need at least 0.5 ETH.");
    console.log("Get testnet ETH from Base Sepolia faucets:");
    console.log("1. Official Base Faucet: https://www.base.org/sepolia-faucet");
    console.log("2. Coinbase Faucet: https://faucet.coinbase.com/");
    console.log("3. Alchemy Faucet: https://sepoliafaucet.com/");
  } else {
    console.log("\n✅ You have enough ETH to mint an NFT.");
    console.log("Run the following command to mint:");
    console.log("npx hardhat run scripts/mint-nft-fixed.js --network baseSepolia");
  }
  
  // Try to check NFT ownership if contract is accessible
  try {
    // Get the contract instance
    const NFTLand = await hre.ethers.getContractFactory("NFTLand");
    const nftLand = await NFTLand.attach(contractAddress);
    
    const nftBalance = await nftLand.balanceOf(signer.address);
    console.log("\nNFTs owned:", nftBalance.toString());
    
    if (nftBalance.gt(0)) {
      console.log("\nYour NFT IDs:");
      for (let i = 0; i < nftBalance; i++) {
        const tokenId = await nftLand.tokenOfOwnerByIndex(signer.address, i);
        console.log(`NFT #${tokenId}`);
      }
      console.log("\nView your NFTs on BaseScan:");
      console.log(`https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
    }
  } catch (error) {
    console.log("\nCouldn't check NFT ownership:", error.message);
    console.log("You can check your NFTs on BaseScan manually:");
    console.log(`https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 