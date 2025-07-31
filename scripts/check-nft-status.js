// scripts/check-nft-status.js
// This script checks NFT ownership and contract status

const hre = require("hardhat");

async function main() {
  // Contract address that was deployed on Base Sepolia
  const contractAddress = "0x57F458a41d4248569dA4E8bE7405230E178d5562";

  // Get the contract instance
  const NFTLand = await hre.ethers.getContractFactory("NFTLand");
  const nftLand = await NFTLand.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);

  // Check contract supply details
  const totalSupply = await nftLand.totalSupply();
  const maxSupply = await nftLand.MAX_SUPPLY();
  const reserved = await nftLand.RESERVED();
  const reservedMinted = await nftLand.reservedMinted();
  
  console.log("\n=== NFT Contract Status ===");
  console.log("Total NFTs minted:", totalSupply.toString());
  console.log("Maximum supply:", maxSupply.toString());
  console.log("Reserved for team:", reserved.toString());
  console.log("Reserved minted so far:", reservedMinted.toString());
  console.log("Available for public:", (maxSupply.sub(reserved).add(reservedMinted).sub(totalSupply)).toString());
  
  // Check current price
  const ethPrice = await nftLand.getLatestETHPrice();
  const usdPrice = await nftLand.USD_PRICE();
  // Convert to ETH amount (USD price has 18 decimals, ETH price has 8 decimals)
  const ethCost = usdPrice.mul(hre.ethers.utils.parseEther("1")).div(ethPrice.mul(10**10));
  
  console.log("\n=== Pricing ===");
  console.log("Current ETH/USD rate: $", ethPrice.toString() / 1e8);
  console.log("USD price per NFT: $", hre.ethers.utils.formatEther(usdPrice));
  console.log("Cost in ETH:", hre.ethers.utils.formatEther(ethCost), "ETH");
  
  // Check NFTs owned by the user
  const balance = await nftLand.balanceOf(signer.address);
  console.log("\n=== Your NFT Holdings ===");
  console.log("Number of NFTs owned:", balance.toString());
  
  if (balance.gt(0)) {
    console.log("\nYour NFT IDs:");
    for (let i = 0; i < balance; i++) {
      const tokenId = await nftLand.tokenOfOwnerByIndex(signer.address, i);
      console.log(`NFT #${tokenId}`);
    }
  }
  
  // Check wallet ETH balance
  const ethBalance = await signer.getBalance();
  console.log("\n=== Your Wallet ===");
  console.log("ETH balance:", hre.ethers.utils.formatEther(ethBalance), "ETH");
  if (ethBalance.lt(ethCost)) {
    console.log("⚠️ You don't have enough ETH to mint an NFT");
  } else {
    console.log("✅ You have enough ETH to mint an NFT");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 