const axios = require('axios');

async function main() {
  const tokenId = 1; // Check the first NFT
  const ipfsCid = "bafybeihfjn5yydqursevkqg2hemlfrwmbrnlxue5w66igcy7o62e4ycs2a";

  console.log("Checking IPFS gateways for metadata and video...");

  // Check different IPFS gateways for metadata
  const gateways = [
    `https://ipfs.io/ipfs/${ipfsCid}/${tokenId}.json`,
    `https://gateway.pinata.cloud/ipfs/${ipfsCid}/${tokenId}.json`,
    `https://cloudflare-ipfs.com/ipfs/${ipfsCid}/${tokenId}.json`
  ];

  console.log("\nChecking metadata through IPFS gateways:");
  for (const gateway of gateways) {
    try {
      const response = await axios.get(gateway);
      console.log(`\nGateway ${gateway}:`);
      console.log("Status:", response.status);
      console.log("Metadata:", JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(`\nGateway ${gateway}:`);
      console.log("Error:", error.message);
    }
  }

  // Check video file through different gateways
  console.log("\nChecking video file through IPFS gateways:");
  const videoGateways = [
    `https://ipfs.io/ipfs/${ipfsCid}/rose_${tokenId}.mp4`,
    `https://gateway.pinata.cloud/ipfs/${ipfsCid}/rose_${tokenId}.mp4`,
    `https://cloudflare-ipfs.com/ipfs/${ipfsCid}/rose_${tokenId}.mp4`
  ];

  for (const gateway of videoGateways) {
    try {
      const response = await axios.head(gateway);
      console.log(`\nGateway ${gateway}:`);
      console.log("Status:", response.status);
      console.log("Content-Type:", response.headers['content-type']);
    } catch (error) {
      console.log(`\nGateway ${gateway}:`);
      console.log("Error:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 