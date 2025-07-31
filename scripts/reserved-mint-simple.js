// scripts/reserved-mint-simple.js
// This script mints a reserved NFT from the NFTLandSimple contract (owner only)

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
  
  // Check if user is the owner
  try {
    const owner = await nftLandSimple.owner();
    console.log("Contract owner:", owner);
    
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      console.log("Error: You are not the owner of this contract!");
      console.log("Only the owner can mint reserved NFTs.");
      return;
    }
    
    // Check how many reserved NFTs are left
    const reserved = 3; // As defined in the contract
    const reservedMinted = await nftLandSimple.reservedMinted();
    console.log("Reserved NFTs minted so far:", reservedMinted.toString());
    console.log("Reserved NFTs remaining:", (reserved - reservedMinted).toString());
    
    if (reservedMinted.gte(reserved)) {
      console.log("All reserved NFTs have been minted already.");
      return;
    }
    
    // Mint a reserved NFT
    console.log("Minting a reserved NFT...");
    const tx = await nftLandSimple.reserveMint(signer.address, {
      gasLimit: 200000 // Explicit gas limit to avoid estimation errors
    });
    
    console.log("Reserved mint transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Transaction mined! Reserved NFT minted successfully.");
    
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