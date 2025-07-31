// scripts/mint-simple.js
// This script mints an NFT from the NFTLandSimple contract (fixed 0.001 ETH price)

const hre = require("hardhat");

async function main() {
  // Deployed NFTLandSimple contract address on Base Sepolia
  const contractAddress = "0x122ae910b13eDb48C881BE4E36D6012DE9Cc2d3d";

  // Get the contract instance
  const NFTLandSimple = await hre.ethers.getContractFactory("NFTLandSimple");
  const nftLandSimple = await NFTLandSimple.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);
  
  // Check current contract state
  try {
    const totalSupply = await nftLandSimple.totalSupply();
    console.log("Current total supply:", totalSupply.toString());
    
    const mintPrice = await nftLandSimple.MINT_PRICE();
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
    const tx = await nftLandSimple.mint({ 
      value: mintPrice,
      gasLimit: 200000 // Explicit gas limit to avoid estimation errors
    });
    
    console.log("Mint transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! NFT minted successfully.");
    
    // Get the current NFT balance
    const nftBalance = await nftLandSimple.balanceOf(signer.address);
    console.log("You now own", nftBalance.toString(), "NFTs from this contract");
    
    // Get the latest token ID owned by the user
    if (nftBalance.gt(0)) {
      const tokenId = await nftLandSimple.tokenOfOwnerByIndex(signer.address, nftBalance.sub(1));
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