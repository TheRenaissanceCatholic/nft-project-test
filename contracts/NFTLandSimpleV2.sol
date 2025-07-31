// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Simplified NFT contract with a fixed mint price for testing
// This version starts token IDs from 1 instead of 0
contract NFTLandSimpleV2 is ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 777;
    uint256 public constant RESERVED = 3;
    uint256 public reservedMinted;
    string private baseTokenURI;
    
    // Fixed mint price of 0.001 ETH for testing
    uint256 public constant MINT_PRICE = 0.001 ether;
    
    // Track the next token ID to mint (starting from 1)
    uint256 private nextTokenId = 1;

    constructor(string memory _baseTokenURI) ERC721("NFT Land Testing V2", "LANDTESTV2") {
        baseTokenURI = _baseTokenURI;
    }

    // Mint for the public with fixed price of 0.001 ETH
    function mint() external payable {
        require(totalSupply() < MAX_SUPPLY - RESERVED + reservedMinted, "Sold out");
        require(msg.value >= MINT_PRICE, "Insufficient ETH sent");
        
        _safeMint(msg.sender, nextTokenId);
        nextTokenId++;
    }

    // Reserved mint for owner/team (free)
    function reserveMint(address to) external onlyOwner {
        require(reservedMinted < RESERVED, "All reserved minted");
        reservedMinted++;
        
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    // Set base URI (for metadata)
    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
    
    // Withdraw funds to owner
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
} 