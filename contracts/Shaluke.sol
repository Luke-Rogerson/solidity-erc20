pragma solidity ^0.8.9;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC20Metadata} from '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';

contract ShalukeToken is IERC20, IERC20Metadata {
    // TODO uint256?
    mapping(address => uint) public balances;
    string tokenName = 'Shaluke';
    string tokenSymbol = 'SHALUKE';

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

    function totalSupply() external view returns (uint256) {
        return 1;
    }

    function balanceOf(address account) external view returns (uint256) {
        return 1;
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return 1;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        return true;
    }

    function name() external view returns (string memory) {
        return tokenName;
    }

    function symbol() external view returns (string memory) {
        return tokenSymbol;
    }

    function decimals() external view returns (uint8) {
        return 18;
    }
}
