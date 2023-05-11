pragma solidity ^0.8.9;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract ShalukeToken {
    // TODO uint256?
    mapping(address => uint) public balances;
    // Should we import the event or redeclare as we have done here?
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 initialSupply) {
        balances[msg.sender] = initialSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        if (balances[msg.sender] < amount) {
            return false;
        }

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }
}
