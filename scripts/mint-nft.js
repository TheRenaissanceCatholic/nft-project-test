// scripts/mint-nft.js
// This script mints an NFT from the deployed NFTLand contract

const hre = require("hardhat");

async function main() {
  // Contract address that was deployed on Base Sepolia
  const contractAddress = "0x57F458a41d4248569dA4E8bE7405230E178d5562";

  // Get the contract instance
  const NFTLand = await hre.ethers.getContractFactory("NFTLand");
  const nftLand = await NFTLand.attach(contractAddress);

  // Get the current ETH price from the contract
  const ethPrice = await nftLand.getLatestETHPrice();
  console.log("Current ETH/USD price:", ethPrice.toString());

  // The contract expects $1000 worth of ETH (with 18 decimals)
  // ETH price from Chainlink has 8 decimals
  // Calculate how much ETH we need to send
  const usdPrice = hre.ethers.utils.parseEther("1000"); // $1000 with 18 decimals
  const requiredETH = usdPrice.mul(hre.ethers.utils.parseEther("1")).div(ethPrice.mul(10**10));
  
  console.log("Required ETH for minting:", hre.ethers.utils.formatEther(requiredETH), "ETH");

  // Add a small buffer (5%) to make sure the transaction doesn't fail due to price fluctuations
  const buffer = requiredETH.mul(5).div(100);
  const totalETH = requiredETH.add(buffer);
  
  console.log("Sending ETH (with 5% buffer):", hre.ethers.utils.formatEther(totalETH), "ETH");

  // Call the mint function with the correct amount of ETH
  try {
    const tx = await nftLand.mint({ value: totalETH });
    console.log("Mint transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! NFT minted successfully.");
    
    // Get the new total supply to know the token ID
    const totalSupply = await nftLand.totalSupply();
    console.log("Your newly minted token ID:", totalSupply.toString());
    console.log("View on BaseScan:", `https://sepolia.basescan.org/token/${contractAddress}?a=${totalSupply.toString()}`);
  } catch (error) {
    console.error("Error minting NFT:", error.message);
    if (error.message.includes("insufficient funds")) {
      const signers = await hre.ethers.getSigners();
      const balance = await signers[0].getBalance();
      console.log("Your current wallet balance:", hre.ethers.utils.formatEther(balance), "ETH");
      console.log("You need at least:", hre.ethers.utils.formatEther(totalETH), "ETH");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 