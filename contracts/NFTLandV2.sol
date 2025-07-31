// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract NFTLandV2 is ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 777;
    uint256 public constant RESERVED = 3;
    uint256 public totalMinted;
    uint256 public reservedMinted;
    string private baseTokenURI;
    AggregatorV3Interface internal priceFeed;
    
    // Lower price: $10 instead of $1000 (with 18 decimals)
    uint256 public constant USD_PRICE = 10 * 1e18; 
    
    // Fallback price in case price feed fails
    uint256 public fallbackEthPrice = 2000 * 1e8; // $2000 per ETH with 8 decimals
    bool public useFallbackPrice = false;

    constructor(string memory _baseTokenURI, address _priceFeed) ERC721("NFT Land Access V2", "LANDNFTV2") {
        baseTokenURI = _baseTokenURI;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // Mint for the public
    function mint() external payable {
        require(totalSupply() < MAX_SUPPLY - RESERVED + reservedMinted, "Sold out");
        
        uint256 ethPrice;
        if (useFallbackPrice) {
            ethPrice = fallbackEthPrice;
        } else {
            try priceFeed.latestRoundData() returns (uint80, int price, uint, uint, uint80) {
                require(price > 0, "Invalid price");
                ethPrice = uint256(price);
            } catch {
                // If price feed fails, use fallback price
                ethPrice = fallbackEthPrice;
            }
        }
        
        uint256 requiredETH = (USD_PRICE * 1e18) / ethPrice / 1e8;
        require(msg.value >= requiredETH, "Insufficient ETH sent");
        
        totalMinted++;
        _safeMint(msg.sender, totalSupply());
    }

    // Reserved mint for owner/team
    function reserveMint(address to) external onlyOwner {
        require(reservedMinted < RESERVED, "All reserved minted");
        reservedMinted++;
        _safeMint(to, totalSupply());
    }

    // Toggle between using price feed or fallback price
    function toggleFallbackPrice() external onlyOwner {
        useFallbackPrice = !useFallbackPrice;
    }
    
    // Set fallback ETH price (with 8 decimals like Chainlink)
    function setFallbackEthPrice(uint256 _price) external onlyOwner {
        require(_price > 0, "Price must be greater than 0");
        fallbackEthPrice = _price;
    }

    // Chainlink price feed for ETH/USD
    function getLatestETHPrice() public view returns (uint256) {
        if (useFallbackPrice) {
            return fallbackEthPrice;
        }
        
        try priceFeed.latestRoundData() returns (uint80, int price, uint, uint, uint80) {
            require(price > 0, "Invalid price");
            return uint256(price);
        } catch {
            return fallbackEthPrice;
        }
    }

    // Calculate how much ETH is needed to mint
    function getMintPrice() public view returns (uint256) {
        uint256 ethPrice = getLatestETHPrice();
        return (USD_PRICE * 1e18) / ethPrice / 1e8;
    }

    // Set base URI (for metadata)
    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
} 