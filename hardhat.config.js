require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      // Your Alchemy Base Sepolia RPC URL
      url: "https://base-sepolia.g.alchemy.com/v2/2kJcVipgpw3tdv6LvlpGk4cNm7w9yWVf",
      // Your wallet's private key (keep this secret!)
      accounts: ["6d2c7fb4cbc8b408f673f590f78b339a3f58d32232bbd048371cdde139b8f505"]
    }
  },
  etherscan: {
    apiKey: {
      baseSepolia: "7WMKIW8GVXV81K41NSGSM7MRD2GPHPVJF6"
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  }
}; 