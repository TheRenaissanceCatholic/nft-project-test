// scripts/reserved-mint-v2.js
// This script tests the reserveMint function (owner only) for NFTLandV2

const hre = require("hardhat");

async function main() {
  // Deployed NFTLandV2 contract address on Base Sepolia
  const contractAddress = "0xBAA227b1e70FC14C63B1084b852F5DdD29f77E6d";

  // Get the contract instance
  const NFTLandV2 = await hre.ethers.getContractFactory("NFTLandV2");
  const nftLandV2 = await NFTLandV2.attach(contractAddress);

  // Get the signer's address
  const [owner] = await hre.ethers.getSigners();
  console.log("Minting from owner address:", owner.address);

  // Check if the signer is the owner
  try {
    const contractOwner = await nftLandV2.owner();
    console.log("Contract owner:", contractOwner);
    
    if (owner.address.toLowerCase() !== contractOwner.toLowerCase()) {
      console.log("You are not the owner of this contract.");
      console.log("Only the owner can call the reserveMint function.");
      return;
    }
  } catch (error) {
    console.error("Error checking owner:", error.message);
    return;
  }

  // Check how many reserved NFTs are left
  try {
    const reserved = 3; // As defined in the contract
    const reservedMinted = await nftLandV2.reservedMinted();
    console.log("Reserved NFTs minted so far:", reservedMinted.toString());
    console.log("Reserved NFTs remaining:", (reserved - reservedMinted).toString());

    if (reservedMinted < reserved) {
      try {
        // Call the reserveMint function - we're minting to the owner's address
        console.log("Minting a reserved NFT...");
        
        const tx = await nftLandV2.reserveMint(owner.address, {
          gasLimit: 200000 // Explicit gas limit to avoid estimation errors
        });
        
        console.log("Reserved mint transaction hash:", tx.hash);
        console.log("Waiting for transaction to be mined...");
        
        await tx.wait();
        console.log("Transaction mined! Reserved NFT minted successfully.");
        
        // Get the new total supply to know the token ID
        const totalSupply = await nftLandV2.totalSupply();
        console.log("Your newly minted token ID:", totalSupply.sub(1).toString());
        console.log("View on BaseScan:", `https://sepolia.basescan.org/token/${contractAddress}?a=${owner.address}`);
      } catch (error) {
        console.error("Error in reserved minting:", error.message);
      }
    } else {
      console.log("All reserved NFTs have been minted already.");
    }
  } catch (error) {
    console.error("Error checking reserved NFTs:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 