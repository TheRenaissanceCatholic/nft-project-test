// scripts/mint-nft-fixed.js
// This script mints an NFT from the deployed NFTLand contract using a fixed amount

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
  
  // Check total supply
  try {
    const totalSupply = await nftLand.totalSupply();
    console.log("Current total supply:", totalSupply.toString());
  } catch (error) {
    console.log("Couldn't get total supply:", error.message);
  }
  
  // Fixed amount of ETH to send: 0.5 ETH should be more than enough
  // The contract requires $1000 worth of ETH, and even at high ETH prices, 0.5 ETH should cover it
  const ethToSend = hre.ethers.utils.parseEther("0.5");
  console.log("Sending fixed amount:", hre.ethers.utils.formatEther(ethToSend), "ETH");

  // Check wallet balance first
  const balance = await signer.getBalance();
  console.log("Your wallet balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(ethToSend)) {
    console.log("You don't have enough ETH. Please get some testnet ETH from a faucet.");
    return;
  }

  // Call the mint function with the ETH amount
  try {
    console.log("Minting NFT...");
    const tx = await nftLand.mint({ value: ethToSend });
    console.log("Mint transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! NFT minted successfully.");
    
    // Get the new total supply to know the token ID
    try {
      const newTotalSupply = await nftLand.totalSupply();
      console.log("Your newly minted token ID:", newTotalSupply.toString());
      console.log("View on BaseScan:", `https://sepolia.basescan.org/token/${contractAddress}?a=${newTotalSupply.toString()}`);
    } catch (error) {
      console.log("Couldn't get new total supply, but NFT was minted successfully.");
      console.log("Check your NFTs at:", `https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
    }
  } catch (error) {
    console.error("Error minting NFT:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 