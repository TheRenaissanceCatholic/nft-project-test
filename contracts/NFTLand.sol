// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract NFTLand is ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 777;
    uint256 public constant RESERVED = 3;
    uint256 public totalMinted;
    uint256 public reservedMinted;
    string private baseTokenURI;
    AggregatorV3Interface internal priceFeed;
    uint256 public constant USD_PRICE = 1000 * 1e18; // $1000, 18 decimals for USD

    constructor(string memory _baseTokenURI, address _priceFeed) ERC721("NFT Land Access", "LANDNFT") {
        baseTokenURI = _baseTokenURI;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // Mint for the public
    function mint() external payable {
        require(totalSupply() < MAX_SUPPLY - RESERVED + reservedMinted, "Sold out");
        uint256 ethPrice = getLatestETHPrice();
        uint256 requiredETH = (USD_PRICE * 1e18) / ethPrice;
        require(msg.value >= requiredETH, "Insufficient ETH sent");
        totalMinted++;
        _safeMint(msg.sender, totalSupply() + 1);
    }

    // Reserved mint for owner/team
    function reserveMint(address to) external onlyOwner {
        require(reservedMinted < RESERVED, "All reserved minted");
        reservedMinted++;
        _safeMint(to, totalSupply() + 1);
    }

    // Chainlink price feed for ETH/USD
    function getLatestETHPrice() public view returns (uint256) {
        (, int price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price); // 8 decimals
    }

    // Set base URI (for metadata)
    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
} 