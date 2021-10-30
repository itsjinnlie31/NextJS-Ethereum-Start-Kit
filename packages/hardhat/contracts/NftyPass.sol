// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftyPass is ERC721, ERC721Enumerable, Pausable, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;

	uint256 public constant MAX_TOKENS = 9000;
	uint256 public constant PRICE = 0.05 ether;
	uint256 public constant PURCHASE_LIMIT = 5;
	string private _passBaseURI = "";

	constructor(string memory baseURI) ERC721("NftyPass", "NFTY") {
		_passBaseURI = baseURI;
	}

	function safeMint(address to) external payable whenNotPaused {
		require(PRICE <= msg.value, "ETH amount is not sufficient");
		require(totalSupply() < MAX_TOKENS, "Maximum amount has been reached!");

		_safeMint(to, _tokenIdCounter.current());
		_tokenIdCounter.increment();
	}

	function batchSafeMint(uint256 numberOfTokens, address to) external payable whenNotPaused {
		require(numberOfTokens <= PURCHASE_LIMIT, "Can only mint up to 5 tokens");
		require(PRICE * numberOfTokens <= msg.value, "ETH amount is not sufficient");
		require(totalSupply() + numberOfTokens <= MAX_TOKENS, "Maximum amount has been reached!");

		for (uint256 i = 0; i < numberOfTokens; i++) {
			_safeMint(to, _tokenIdCounter.current());
			_tokenIdCounter.increment();
		}
	}

	function setBaseURI(string memory baseURI) external onlyOwner {
		_passBaseURI = baseURI;
	}

	function pause() external onlyOwner {
		_pause();
	}

	function unpause() external onlyOwner {
		_unpause();
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId
	) internal override(ERC721, ERC721Enumerable) whenNotPaused {
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function withdraw() external onlyOwner {
		uint256 balance = address(this).balance;
		(bool succeed, ) = msg.sender.call{value: balance}("");

		require(succeed, "Failed to withdraw Ether");
	}

	function _baseURI() internal view virtual override returns (string memory) {
		return _passBaseURI;
	}

	function tokensOfOwner(address owner) external view returns (uint256[] memory) {
		uint256 numOfPasses = balanceOf(owner);

		uint256[] memory passes = new uint256[](numOfPasses);
		for (uint256 i; i < numOfPasses; i++) {
			passes[i] = tokenOfOwnerByIndex(owner, i);
		}

		return passes;
	}

	function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
