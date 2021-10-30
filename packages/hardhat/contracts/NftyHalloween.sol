// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@1001-digital/erc721-extensions/contracts/RandomlyAssigned.sol";

import "./ERC721CustomEnumerable.sol";

contract NftyHalloween is ERC721, Pausable, Ownable, RandomlyAssigned, ERC721CustomEnumerable {
	uint256 public constant MAX_TOKENS = 9000;
	string private nftyBaseURI = "";
	IERC721 public nftyPass;

	mapping(uint256 => address) private claimed;

	constructor(string memory _nftyBaseURI, address _nftyPass)
		ERC721("NftyHalloween", "NFTYH")
		RandomlyAssigned(MAX_TOKENS, 0)
	{
		nftyBaseURI = _nftyBaseURI;
		nftyPass = IERC721(_nftyPass);
	}

	function mint(uint256 pass) external whenNotPaused {
		require(nftyPass.ownerOf(pass) == msg.sender, "Pass not owned by sender");
		require(claimed[pass] == address(0), "Pass already used");

		claimed[pass] = msg.sender;
		uint256 next = nextToken();
		_safeMint(msg.sender, next);
	}

	function setBaseURI(string memory baseURI) external onlyOwner {
		nftyBaseURI = baseURI;
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
	) internal override(ERC721, ERC721CustomEnumerable) {
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function _baseURI() internal view virtual override returns (string memory) {
		return nftyBaseURI;
	}

	function claimedPass(uint256 pass) public view returns (address) {
		address claimedAddress = claimed[pass];
		require(claimedAddress != address(0), "Pass not claimed");

		return claimedAddress;
	}

	function tokensOfOwner(address owner) external view returns (uint256[] memory) {
		uint256 numOfTokens = balanceOf(owner);

		uint256[] memory tokens = new uint256[](numOfTokens);
		for (uint256 i; i < numOfTokens; i++) {
			tokens[i] = tokenOfOwnerByIndex(owner, i);
		}

		return tokens;
	}

	function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721CustomEnumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
