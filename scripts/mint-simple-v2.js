// scripts/mint-simple-v2.js
// This script mints an NFT from the NFTLandSimpleV2 contract (fixed 0.001 ETH price, IDs start at 1)

const hre = require("hardhat");

async function main() {
  // Contract address from deployment
  const contractAddress = "0xcEB376FDB26F7CBbe5fEE41e70aE7939EA369C6a";

  // Get the contract instance
  const NFTLandSimpleV2 = await hre.ethers.getContractFactory("NFTLandSimpleV2");
  const nftLandSimpleV2 = await NFTLandSimpleV2.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);
  
  // Check current contract state
  try {
    const totalSupply = await nftLandSimpleV2.totalSupply();
    console.log("Current total supply:", totalSupply.toString());
    
    const mintPrice = await nftLandSimpleV2.MINT_PRICE();
    console.log("Mint price:", hre.ethers.utils.formatEther(mintPrice), "ETH");
    
    // Check wallet balance
    const balance = await signer.getBalance();
    console.log("Your wallet balance:", hre.ethers.utils.formatEther(balance), "ETH");
    
    if (balance.lt(mintPrice)) {
      console.log("Error: You don't have enough ETH to mint. Please get some testnet ETH from a faucet.");
      return;
    }
    
    // Mint the NFT
    console.log("Minting NFT...");
    const tx = await nftLandSimpleV2.mint({ 
      value: mintPrice,
      gasLimit: 200000 // Explicit gas limit to avoid estimation errors
    });
    
    console.log("Mint transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! NFT minted successfully.");
    
    // Get the current NFT balance
    const nftBalance = await nftLandSimpleV2.balanceOf(signer.address);
    console.log("You now own", nftBalance.toString(), "NFTs from this contract");
    
    // Get the latest token ID owned by the user
    if (nftBalance.gt(0)) {
      // Since we're using enumerable, we can get the token ID this way
      const tokenId = await nftLandSimpleV2.tokenOfOwnerByIndex(signer.address, nftBalance.sub(1));
      console.log("Your newly minted NFT ID:", tokenId.toString());
      console.log("View on BaseScan:", `https://sepolia.basescan.org/token/${contractAddress}?a=${signer.address}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 