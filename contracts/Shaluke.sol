pragma solidity ^0.8.9;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC20Metadata} from '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';

import 'hardhat/console.sol';

contract ShalukeToken is IERC20, IERC20Metadata {
    // TODO uint256?
    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) public allowances;

    string constant TOKEN_NAME = 'Shaluke';
    string constant TOKEN_SYMBOL = 'SHALUKE';
    uint256 immutable TOTAL_SUPPLY;

    constructor(uint256 initialSupply) {
        balances[msg.sender] = initialSupply;
        TOTAL_SUPPLY = initialSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
    }

    function _transfer(address from, address to, uint256 amount) private returns (bool) {
        if (balances[from] < amount) {
            return false;
        }

        balances[from] -= amount;
        balances[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function totalSupply() external view returns (uint256) {
        return TOTAL_SUPPLY;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return allowances[owner][spender];
    }

    // Should this ever fail?
    function approve(address spender, uint256 amount) external returns (bool) {
        // No need to check balance of sender here?
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (allowances[from][msg.sender] < amount) {
            return false;
        }

        allowances[from][msg.sender] -= amount;
        _transfer(from, to, amount);
    }

    function name() external view returns (string memory) {
        return TOKEN_NAME;
    }

    function symbol() external view returns (string memory) {
        return TOKEN_SYMBOL;
    }

    function decimals() external view returns (uint8) {
        return 18;
    }
}
