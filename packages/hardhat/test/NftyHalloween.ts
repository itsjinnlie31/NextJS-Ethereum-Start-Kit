import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { chaiEthers } from "chai-ethers";
import { Signer } from "ethers";
import { NftyHalloween, NftyHalloween__factory, NftyPass, NftyPass__factory } from "frontend/types/typechain";
import { ethers } from "hardhat";

chai.use(chaiEthers);
chai.use(chaiAsPromised);
const { expect, assert } = chai;

describe("Nfty Halloween", function () {
	let accounts: Signer[];
	const uri = "www.placeholder.com/";

	let passContract: NftyPass;
	let halloweenContract: NftyHalloween;

	beforeEach(async function () {
		accounts = await ethers.getSigners();

		const passFactory = (await ethers.getContractFactory("NftyPass", accounts[0])) as NftyPass__factory;
		passContract = await passFactory.deploy("some-uri");

		const halloweenFactory = (await ethers.getContractFactory(
			"NftyHalloween",
			accounts[0],
		)) as NftyHalloween__factory;
		halloweenContract = await halloweenFactory.deploy(uri, passContract.address);
	});

	describe("Init", function () {
		it("Should set max token supply", async function () {
			const maxTokens = await halloweenContract.MAX_TOKENS();
			expect(await halloweenContract.totalSupply()).to.equal(maxTokens);
		});
	});

	describe("Mint", function () {
		beforeEach(async () => {
			const value = await passContract.PRICE();

			await passContract.safeMint(await accounts[0].getAddress(), {
				value,
			});
			await passContract.safeMint(await accounts[1].getAddress(), {
				value,
			});
			await passContract.safeMint(await accounts[2].getAddress(), {
				value,
			});
		});
		it("Should Mint successfully", async function () {
			expect(await halloweenContract.tokenCount()).to.equal(0);

			await halloweenContract.connect(accounts[0]).mint(0);
			expect(await halloweenContract.claimedPass(0)).to.equal(await accounts[0].getAddress());

			await halloweenContract.connect(accounts[1]).mint(1);
			expect(await halloweenContract.claimedPass(1)).to.equal(await accounts[1].getAddress());

			await halloweenContract.connect(accounts[2]).mint(2);
			expect(await halloweenContract.claimedPass(2)).to.equal(await accounts[2].getAddress());

			expect(await halloweenContract.tokenCount()).to.equal(3);

			expect(halloweenContract.claimedPass(3)).eventually.to.be.rejectedWith("Pass not claimed");
		});

		it("Should Throw Pass not owned by sender", async function () {
			expect(halloweenContract.connect(accounts[0]).mint(1)).eventually.to.be.rejectedWith(
				"Pass not owned by sender",
			);
		});

		it("Should Throw Pass already used", async function () {
			await halloweenContract.connect(accounts[0]).mint(0);

			expect(halloweenContract.connect(accounts[0]).mint(0)).eventually.to.be.rejectedWith("Pass already used");
		});

		it("Should Mint - with different address", async function () {
			await passContract
				.connect(accounts[0])
				.transferFrom(await accounts[0].getAddress(), await accounts[1].getAddress(), 0);

			// tslint:disable-next-line:no-unused-expression
			expect(halloweenContract.connect(accounts[1]).mint(0)).eventually.to.be.fulfilled;
		});

		it("Should Throw Pass already used - with different address", async function () {
			await halloweenContract.connect(accounts[0]).mint(0);
			await passContract
				.connect(accounts[0])
				.transferFrom(await accounts[0].getAddress(), await accounts[1].getAddress(), 0);

			expect(halloweenContract.connect(accounts[1]).mint(0)).eventually.to.be.rejectedWith("Pass already used");
		});

		it("Should Reject because pass not owned by sender even if its approved", async function () {
			await passContract.connect(accounts[0]).approve(await accounts[1].getAddress(), 0);

			expect(halloweenContract.connect(accounts[1]).mint(0)).eventually.to.be.rejectedWith(
				"Pass not owned by sender",
			);
		});

		it("Should Reject because pass not owned by sender even if its approved for all", async function () {
			await passContract.connect(accounts[0]).setApprovalForAll(await accounts[1].getAddress(), true);

			expect(halloweenContract.connect(accounts[1]).mint(0)).eventually.to.be.rejectedWith(
				"Pass not owned by sender",
			);
		});
	});

	describe("tokensOfOwner", function () {
		it("Should Return Correct Token Ids", async function () {
			const value = await passContract.PRICE();

			await passContract.safeMint(await accounts[0].getAddress(), {
				value,
			});
			await passContract.safeMint(await accounts[1].getAddress(), {
				value,
			});
			await passContract.safeMint(await accounts[1].getAddress(), {
				value,
			});

			await halloweenContract.connect(accounts[0]).mint(0);
			await halloweenContract.connect(accounts[1]).mint(1);
			await halloweenContract.connect(accounts[1]).mint(2);

			const address1 = await halloweenContract.tokensOfOwner(await accounts[0].getAddress());
			assert.equal(
				address1[0].toNumber(),
				(await halloweenContract.tokenOfOwnerByIndex(await accounts[0].getAddress(), 0)).toNumber(),
			);

			const address2 = await halloweenContract.tokensOfOwner(await accounts[1].getAddress());
			assert.equal(
				address2[0].toNumber(),
				(await halloweenContract.tokenOfOwnerByIndex(await accounts[1].getAddress(), 0)).toNumber(),
			);
			assert.equal(
				address2[1].toNumber(),
				(await halloweenContract.tokenOfOwnerByIndex(await accounts[1].getAddress(), 1)).toNumber(),
			);
		});
	});
});
