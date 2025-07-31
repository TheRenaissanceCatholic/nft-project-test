// scripts/reserved-mint.js
// This script tests the reserveMint function (owner only)

const hre = require("hardhat");

async function main() {
  // Contract address that was deployed on Base Sepolia
  const contractAddress = "0x57F458a41d4248569dA4E8bE7405230E178d5562";

  // Get the contract instance
  const NFTLand = await hre.ethers.getContractFactory("NFTLand");
  const nftLand = await NFTLand.attach(contractAddress);

  // Get the signer's address
  const [owner] = await hre.ethers.getSigners();
  console.log("Minting from owner address:", owner.address);

  // Check how many reserved NFTs are left
  const reserved = 3; // As defined in the contract
  const reservedMinted = await nftLand.reservedMinted();
  console.log("Reserved NFTs minted so far:", reservedMinted.toString());
  console.log("Reserved NFTs remaining:", (reserved - reservedMinted).toString());

  if (reservedMinted < reserved) {
    try {
      // Call the reserveMint function - we're minting to the owner's address
      const tx = await nftLand.reserveMint(owner.address);
      console.log("Reserved mint transaction hash:", tx.hash);
      console.log("Waiting for transaction to be mined...");
      
      await tx.wait();
      console.log("Transaction mined! Reserved NFT minted successfully.");
      
      // Get the new total supply to know the token ID
      const totalSupply = await nftLand.totalSupply();
      console.log("Your newly minted token ID:", totalSupply.toString());
      console.log("View on BaseScan:", `https://sepolia.basescan.org/token/${contractAddress}?a=${totalSupply.toString()}`);
    } catch (error) {
      console.error("Error in reserved minting:", error.message);
      if (error.message.includes("caller is not the owner")) {
        console.log("You are not the owner of the contract.");
        console.log("Make sure you're using the same account that deployed the contract.");
      }
    }
  } else {
    console.log("All reserved NFTs have been minted already.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 