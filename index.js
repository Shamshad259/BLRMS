const express = require("express");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
app.use(express.json());

// Environment variables
// const INFURA_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Connect wallet for state-changing transactions
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const abi = [
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "string", name: "_owner", type: "string" },
      { internalType: "string", name: "_details", type: "string" },
    ],
    name: "addProperty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "string", name: "_newOwner", type: "string" },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "properties",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "owner", type: "string" },
      { internalType: "string", name: "details", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// Endpoint to fetch property details
app.get("/property/:id", async (req, res) => {
  try {
    const property = await contract.properties(req.params.id);
    res.json(property);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to add a property
app.post("/property", async (req, res) => {
  try {
    const { id, owner, details } = req.body;

    const tx = await contract.addProperty(id, owner, details);
    await tx.wait();
    res.json({ message: "Property added successfully", transactionHash: tx.hash });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to transfer ownership
app.post("/property/transfer", async (req, res) => {
  try {
    const { id, newOwner } = req.body;

    const tx = await contract.transferOwnership(id, newOwner);
    await tx.wait();
    res.json({ message: "Ownership transferred successfully", transactionHash: tx.hash });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
