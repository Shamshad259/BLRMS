// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    struct Property {
        uint256 id;
        string owner;
        string details;
        address[] modificationHistory;
    }

    mapping(uint256 => Property) public properties;

    event PropertyAdded(uint256 id, string owner, string details);
    event OwnershipTransferred(uint256 id, string newOwner);

    // Function to add a property to the registry
    function addProperty(uint256 _id, string memory _owner, string memory _details) public {
        // Ensure the property doesn't already exist
        require(properties[_id].id == 0, "Property already exists");

        // Create a new property and add it to the mapping
        properties[_id] = Property({
            id: _id,
            owner: _owner,
            details: _details,
            modificationHistory: new address[](0)  // Correctly initialize an empty dynamic array
        });

        emit PropertyAdded(_id, _owner, _details);
    }

    // Function to transfer ownership of a property
    function transferOwnership(uint256 _id, string memory _newOwner) public {
        // Ensure the property exists
        require(properties[_id].id != 0, "Property does not exist");

        // Transfer ownership and record the modification
        properties[_id].owner = _newOwner;
        properties[_id].modificationHistory.push(msg.sender);

        emit OwnershipTransferred(_id, _newOwner);
    }
}