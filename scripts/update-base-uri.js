const hre = require("hardhat");

async function main() {
  // Contract address from deployment
  const contractAddress = "0x751256D6c546019bb6E0674EfEc6A7f5c0DbfDDD";
  
  // Get the contract instance
  const NFTLandSimpleV2 = await hre.ethers.getContractFactory("NFTLandSimpleV2");
  const nftLandSimpleV2 = await NFTLandSimpleV2.attach(contractAddress);

  // Get the signer's address
  const [signer] = await hre.ethers.getSigners();
  console.log("Your address:", signer.address);
  
  // Check if user is the owner
  try {
    const owner = await nftLandSimpleV2.owner();
    console.log("Contract owner:", owner);
    
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      console.log("Error: You are not the owner of this contract!");
      return;
    }

    // Update the base URI to use IPFS gateway
    // Replace YOUR_METADATA_CID with the CID you get after uploading to IPFS
    const newBaseURI = "ipfs://QmNfrt44j6SwMW69whZ9uBhbGDg2CmqFPmPiq2ZSnKTXZN/";
    console.log("Updating base URI to:", newBaseURI);
    
    const tx = await nftLandSimpleV2.setBaseURI(newBaseURI);
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for transaction to be mined...");
    
    await tx.wait();
    console.log("Base URI updated successfully!");
    
    // Verify the new base URI
    const currentBaseURI = await nftLandSimpleV2._baseURI();
    console.log("Current base URI:", currentBaseURI);
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