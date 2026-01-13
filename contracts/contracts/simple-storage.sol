    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    contract SimpleStorage {
        //menyimpan sebuah nilai dalam bentuk uint256
        uint256 private storedValue;
        address public owner;
        string public message;

        //ketika ada update saya akan track perubahaannya
        event OwnerSet(address indexed owner);
        event ValueUpdated(uint256 newValue);
        event MessageUpdated(string message);


        constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

        //simpan nilai ke blokcain (write)
        function setValue(uint256 _value) public onlyOwner {
            storedValue = _value;
            emit ValueUpdated(_value);
        }

        // membaca nilai dari blockcain (read) terkahir kali di update
        function getValue() public view returns (uint256) {
            return storedValue;
        }

        // TUGAS 4 (OPTIONAL)
        modifier onlyOwner() {
            require(msg.sender == owner, "Not owner");
            _;
        }

        //pesan
            function setMessage(string memory _message) public onlyOwner {
        message = _message;
        emit MessageUpdated(_message);
        }
    }