import {
	Box,
	Button,
	Divider,
	Heading,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ChainId, useEthers, useSendTransaction } from "@usedapp/core";
import { ethers, providers, utils } from "ethers";
import React, { useReducer } from "react";
import { NftyPass as LOCAL_CONTRACT_ADDRESS } from "hardhat/scripts/contractAddress";
import NftyPassContract from "../artifacts/contracts/NftyPass.sol/NftyPass.json";
import { Layout } from "../components/layout/Layout";
import { NftyPass as NftyPassContractType } from "../types/typechain";

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider("http://localhost:8545");

const RINKEBY_CONTRACT_ADDRESS = "0x8Ba5cE975a075Be7c170F6BA3f937Ed6E1dA0Ed2";

/**
 * Prop Types
 */
type StateType = {
	tokenPrice: string;
	tokenSupply: string;
	maxSupply: string;
	txHashValue: string;
	isLoading: boolean;
	numOfPasses: number;
	allPasses: number[];
};

type ActionType =
	| {
			type: "SET_TOKEN_PRICE";
			tokenPrice: StateType["tokenPrice"];
	  }
	| {
			type: "SET_TOKEN_SUPPLY";
			tokenSupply: StateType["tokenSupply"];
	  }
	| {
			type: "SET_MAX_SUPPLY";
			maxSupply: StateType["maxSupply"];
	  }
	| {
			type: "SET_TX_HASH_VALUE";
			txHashValue: StateType["txHashValue"];
	  }
	| {
			type: "SET_LOADING";
			isLoading: StateType["isLoading"];
	  }
	| {
			type: "SET_PASSES";
			numOfPasses: StateType["numOfPasses"];
	  }
	| {
			type: "SET_ALL_PASSES";
			allPasses: StateType["allPasses"];
	  };

/**
 * Component
 */
const initialState: StateType = {
	tokenPrice: "",
	tokenSupply: "",
	maxSupply: "",
	txHashValue: "-",
	isLoading: false,
	numOfPasses: 1,
	allPasses: [],
};

function reducer(state: StateType, action: ActionType): StateType {
	switch (action.type) {
		// Track the greeting from the blockchain
		case "SET_TOKEN_PRICE":
			return {
				...state,
				tokenPrice: action.tokenPrice,
			};
		case "SET_TOKEN_SUPPLY":
			return {
				...state,
				tokenSupply: action.tokenSupply,
			};
		case "SET_MAX_SUPPLY":
			return {
				...state,
				maxSupply: action.maxSupply,
			};

		case "SET_TX_HASH_VALUE":
			return {
				...state,
				txHashValue: action.txHashValue,
			};
		case "SET_LOADING":
			return {
				...state,
				isLoading: action.isLoading,
			};
		case "SET_PASSES":
			return {
				...state,
				numOfPasses: action.numOfPasses,
			};
		case "SET_ALL_PASSES":
			return {
				...state,
				allPasses: action.allPasses,
			};
		default:
			throw new Error();
	}
}

function HomeIndex(): JSX.Element {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { account, chainId, library } = useEthers();

	const isLocalChain = chainId === ChainId.Localhost || chainId === ChainId.Hardhat;

	const CONTRACT_ADDRESS = chainId === ChainId.Rinkeby ? RINKEBY_CONTRACT_ADDRESS : LOCAL_CONTRACT_ADDRESS;

	// Use the localProvider as the signer to send ETH to our wallet
	const { sendTransaction } = useSendTransaction({
		signer: localProvider.getSigner(),
	});

	// call the smart contract, read the current greeting value
	async function fetchTokenPrice() {
		if (library) {
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				NftyPassContract.abi,
				library,
			) as NftyPassContractType;
			try {
				const data = await contract.PRICE();
				dispatch({ type: "SET_TOKEN_PRICE", tokenPrice: data.toString() });
			} catch (err) {
				// eslint-disable-next-line no-console
				console.log("Error: ", err);
			}
		}
	}

	// call the smart contract, read the current greeting value
	async function fetchTokenSupply() {
		if (library) {
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				NftyPassContract.abi,
				library,
			) as NftyPassContractType;
			try {
				const data1 = await contract.totalSupply();
				dispatch({ type: "SET_TOKEN_SUPPLY", tokenSupply: data1.toString() });

				const data2 = await contract.MAX_TOKENS();
				dispatch({ type: "SET_MAX_SUPPLY", maxSupply: data2.toString() });
			} catch (err) {
				// eslint-disable-next-line no-console
				console.log("Error: ", err);
			}
		}
	}

	// call the smart contract, read the current greeting value
	async function mintTokens() {
		if (library) {
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				NftyPassContract.abi,
				library,
			) as NftyPassContractType;
			try {
				const value = await contract.PRICE();

				let data;
				if (state.numOfPasses == 1) {
					data = await contract.connect(library.getSigner()).safeMint(account, { value });
				} else {
					data = await contract.connect(library.getSigner()).batchSafeMint(state.numOfPasses, account, {
						value: value.mul(state.numOfPasses),
					});
				}

				dispatch({ type: "SET_TX_HASH_VALUE", txHashValue: data.hash });
				await data.wait();
				await fetchTokenSupply();
			} catch (err) {
				// eslint-disable-next-line no-console
				console.log("Error: ", err);
				window.alert(err);
			}
		}
	}

	async function listAllTokens() {
		if (library) {
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				NftyPassContract.abi,
				library,
			) as NftyPassContractType;
			try {
				const data = await contract.tokensOfOwner(account);
				const allPasses = data.map((pass) => pass.toNumber());

				dispatch({ type: "SET_ALL_PASSES", allPasses });
			} catch (err) {
				// eslint-disable-next-line no-console
				console.log("Error: ", err);
			}
		}
	}

	function sendFunds(): void {
		sendTransaction({
			to: account,
			value: utils.parseEther("0.1"),
		});
	}

	return (
		<Layout>
			<Heading as="h1" mb="8">
				NftyVillage - Next.js Ethereum Starter
			</Heading>
			<Button
				as="a"
				size="lg"
				colorScheme="teal"
				variant="outline"
				href="https://github.com/protokol/nextjs-eth-typescript-react-starter-kit"
				target="_blank"
				rel="noopener noreferrer"
			>
				Source code!
			</Button>
			<Text mt="8" fontSize="xl">
				Connect your wallet first! This page only works on the RINKEBY Testnet or on a Local Chain.
			</Text>
			<Box maxWidth="container.xm" p="8" mt="8" bg="gray.100">
				<Link href={`https://rinkeby.etherscan.io/address/${CONTRACT_ADDRESS}`} isExternal>
					Contract Address: <br />
					{CONTRACT_ADDRESS} <ExternalLinkIcon mx="2px" />
				</Link>

				<Divider my="8" borderColor="gray.400" />
				<Box>
					<Text fontSize="lg">Token Price: {state.tokenPrice}</Text>
					<Button mt="2" colorScheme="teal" onClick={fetchTokenPrice}>
						Fetch Token Minting Price
					</Button>
				</Box>
				<Divider my="8" borderColor="gray.400" />
				<Box>
					<Text fontSize="lg">
						Minted supply: {state.tokenSupply} | Maximum Supply: {state.maxSupply}{" "}
					</Text>
					<Button mt="2" colorScheme="teal" onClick={fetchTokenSupply}>
						Fetch Data
					</Button>
				</Box>

				<Divider my="8" borderColor="gray.400" />
				<Box>
					<Text mt="6">Number of NftyPasses:</Text>
					<NumberInput
						size="lg"
						maxW={32}
						background={"white"}
						max={5}
						min={1}
						value={state.numOfPasses}
						onChange={(e) => {
							dispatch({
								type: "SET_PASSES",
								numOfPasses: +e,
							});
						}}
					>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
					<Button
						mt="2"
						mb="3"
						as="a"
						size="lg"
						colorScheme="teal"
						isLoading={state.isLoading}
						onClick={mintTokens}
					>
						Mint/Buy Tokens
					</Button>
				</Box>
				<Box>
					<Link mt="2" href={`https://rinkeby.etherscan.io/tx/${state.txHashValue}`} isExternal>
						Transaction: {state.txHashValue} <ExternalLinkIcon mx="4px" />
					</Link>
				</Box>

				<Divider my="8" borderColor="gray.400" />

				<Button colorScheme="teal" onClick={listAllTokens}>
					List my NftyPasses
				</Button>

				<Box>
					<Text mt="6" mb="2">
						NftyPasses:{" "}
					</Text>
					{state.allPasses.map((pass) => (
						<Link
							key={pass.toString()}
							mr="2"
							href={`https://rinkeby.etherscan.io/token/${CONTRACT_ADDRESS}?a=${pass}`}
							isExternal
						>
							{pass}
						</Link>
					))}
				</Box>

				<Divider my="8" borderColor="gray.400" />

				<Text mb="4">This button only works on a Local Chain.</Text>
				<Button colorScheme="teal" onClick={sendFunds} isDisabled={!isLocalChain}>
					Send Funds From Local Hardhat Chain
				</Button>
			</Box>
		</Layout>
	);
}

export default HomeIndex;
