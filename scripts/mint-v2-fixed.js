// scripts/mint-v2-fixed.js
// This script mints an NFT from the NFTLandV2 contract with a fixed amount

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
  
  // Check total supply
  try {
    const totalSupply = await nftLandV2.totalSupply();
    console.log("Current total supply:", totalSupply.toString());
  } catch (error) {
    console.log("Couldn't get total supply:", error.message);
  }
  
  // Using a higher fixed amount to ensure it passes the price check
  // $10 at $2000 per ETH would be 0.005 ETH, but let's send more to be safe
  const ethToSend = hre.ethers.utils.parseEther("0.01");
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
    
    // Set gas limit explicitly to avoid estimation issues
    const tx = await nftLandV2.mint({ 
      value: ethToSend,
      gasLimit: 200000  // Explicit gas limit to avoid estimation errors
    });
    
    console.log("Mint transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! NFT minted successfully.");
    
    // Get the new total supply to know the token ID
    try {
      const newTotalSupply = await nftLandV2.totalSupply();
      console.log("Your newly minted token ID:", newTotalSupply.sub(1).toString());
      console.log("View on BaseScan:", `https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
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