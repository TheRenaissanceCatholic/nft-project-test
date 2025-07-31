# NFT Land Project 🚀

A comprehensive NFT project built with Hardhat, featuring dynamic pricing, video processing, and multiple contract versions.

## 🌟 Features

- **Dynamic Pricing**: Uses Chainlink price feeds for ETH/USD conversion
- **Multiple Contract Versions**: NFTLand, NFTLandV2, NFTLandSimple, NFTLandSimpleV2
- **Video Processing**: Automated video variation generation with Python
- **Metadata Management**: IPFS-based metadata system
- **Reserved Minting**: 3 reserved NFTs for team/owner
- **Base Sepolia Network**: Configured for Base Sepolia testnet

## 📁 Project Structure

```
nft-land/
├── contracts/           # Smart contracts
│   ├── NFTLand.sol     # Original contract with Chainlink pricing
│   ├── NFTLandV2.sol   # Enhanced version
│   ├── NFTLandSimple.sol # Simplified version
│   └── NFTLandSimpleV2.sol # Latest simplified version
├── scripts/            # Deployment and interaction scripts
│   ├── deploy-*.js     # Contract deployment scripts
│   ├── mint-*.js       # NFT minting scripts
│   ├── check-*.js      # Status checking scripts
│   └── update-*.js     # Configuration update scripts
├── video-processing/   # Video processing pipeline
│   ├── generate_variations.py
│   ├── requirements.txt
│   └── input/output/   # Video processing folders
├── metadata/          # NFT metadata files
└── hardhat.config.js  # Hardhat configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+ (for video processing)

### Installation
```bash
# Clone the repository
git clone https://github.com/TheRenaissanceCatholic/nft-project-test.git
cd nft-project-test

# Install dependencies
npm install

# For video processing (optional)
cd video-processing
pip install -r requirements.txt
```

### Configuration
1. Copy your private key to `hardhat.config.js`
2. Update Alchemy RPC URL if needed
3. Set your Etherscan API key

### Deploy Contracts
```bash
# Deploy to Base Sepolia
npx hardhat run scripts/deploy-base-sepolia.js --network baseSepolia

# Deploy simple version
npx hardhat run scripts/deploy-simple.js --network baseSepolia

# Deploy V2 version
npx hardhat run scripts/deploy-v2.js --network baseSepolia
```

### Mint NFTs
```bash
# Public mint
npx hardhat run scripts/mint-nft.js --network baseSepolia

# Reserved mint (owner only)
npx hardhat run scripts/reserved-mint.js --network baseSepolia

# Check NFT status
npx hardhat run scripts/check-nft-status.js --network baseSepolia
```

## 🎬 Video Processing

The project includes a Python-based video processing pipeline:

```bash
cd video-processing
python generate_variations.py
```

Features:
- Video compression and optimization
- Metadata generation for NFT videos
- Batch processing capabilities

## 🔧 Contract Features

### NFTLand.sol (Original)
- Chainlink price feed integration
- Dynamic ETH/USD pricing
- Reserved minting (3 tokens)
- Maximum supply: 777 NFTs

### NFTLandV2.sol (Enhanced)
- Additional features and optimizations
- Improved gas efficiency
- Enhanced metadata handling

### NFTLandSimple.sol (Simplified)
- Streamlined functionality
- Easier deployment and management
- Reduced complexity

### NFTLandSimpleV2.sol (Latest)
- Latest optimizations
- Enhanced security features
- Improved user experience

## 🌐 Networks

Currently configured for:
- **Base Sepolia Testnet**: For testing and development
- **Alchemy RPC**: High-performance blockchain access
- **Etherscan Verification**: Contract verification support

## 📊 Scripts Overview

### Deployment Scripts
- `deploy.js` - Basic deployment
- `deploy-base-sepolia.js` - Base Sepolia deployment
- `deploy-simple.js` - Simple contract deployment
- `deploy-v2.js` - V2 contract deployment

### Minting Scripts
- `mint-nft.js` - Public minting
- `reserved-mint.js` - Reserved minting
- `mint-v2.js` - V2 minting
- `mint-simple.js` - Simple contract minting

### Management Scripts
- `update-base-uri.js` - Update metadata URI
- `set-mint-price-v2.js` - Update pricing
- `enable-fallback.js` - Enable fallback pricing
- `check-balance.js` - Check contract balance

## 🔍 Status Checking

Monitor your NFTs and contracts:
```bash
# Check NFT status
npx hardhat run scripts/check-nft-status.js --network baseSepolia

# Check contract balance
npx hardhat run scripts/check-balance.js --network baseSepolia

# Check IPFS metadata
npx hardhat run scripts/check-ipfs-metadata.js --network baseSepolia
```

## 🛠️ Development

### Adding New Features
1. Create new contract in `contracts/`
2. Add deployment script in `scripts/`
3. Test thoroughly on testnet
4. Update documentation

### Video Processing
1. Place videos in `video-processing/input/`
2. Run `generate_variations.py`
3. Processed videos in `video-processing/output/`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ by RenaissanceMan** 