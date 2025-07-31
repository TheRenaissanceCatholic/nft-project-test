require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      // Your Alchemy Base Sepolia RPC URL
      url: "https://base-sepolia.g.alchemy.com/v2/2kJcVipgpw3tdv6LvlpGk4cNm7w9yWVf",
      // Your wallet's private key (use environment variable for security)
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
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