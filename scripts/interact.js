const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", owner.address);

    // Assuming the contract is already deployed at this address
    const landRegistryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your deployed contract address
    const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
    const landRegistry = LandRegistry.attach(landRegistryAddress);

    // Add a property (this will call the addProperty function)
    const tx = await landRegistry.addProperty(12345, "John Doe", "Property details for John");
    await tx.wait(); // Wait for transaction to be mined
    console.log("Property added!");

    // Transfer ownership (this will call the transferOwnership function)
    const tx2 = await landRegistry.transferOwnership(12345, "Jane Doe");
    await tx2.wait(); // Wait for transaction to be mined
    console.log("Ownership transferred!");

    // Get the property (this will call the getProperty function)
    const property = await landRegistry.properties(12345); // You can directly access the mapping
    console.log("Property details:", property);
}

main().catch((error) => {
    console.error("Error interacting with contract:", error);
    process.exitCode = 1;
});
