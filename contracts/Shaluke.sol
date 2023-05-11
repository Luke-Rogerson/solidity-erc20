// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC20Metadata} from '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';

contract ShalukeToken is IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    string private constant _TOKEN_NAME = 'SHA LUKE';
    string private constant _TOKEN_SYMBOL = 'SHALUKE';
    uint256 private immutable _TOTAL_SUPPLY;

    constructor(uint256 initialSupply) {
        _balances[msg.sender] = initialSupply;
        _TOTAL_SUPPLY = initialSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _transfer(msg.sender, to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        if (_balances[from] < amount) {
            return false;
        }

        _balances[from] -= amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function totalSupply() external view returns (uint256) {
        return _TOTAL_SUPPLY;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    // Should this ever fail?
    function approve(address spender, uint256 amount) external returns (bool) {
        // No need to check balance of sender here?
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (_allowances[from][msg.sender] < amount) {
            return false;
        }

        _allowances[from][msg.sender] -= amount;
        return _transfer(from, to, amount);
    }

    function name() external pure returns (string memory) {
        return _TOKEN_NAME;
    }

    function symbol() external pure returns (string memory) {
        return _TOKEN_SYMBOL;
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }
}
