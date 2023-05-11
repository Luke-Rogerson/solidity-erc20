import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

function deployShalukeFixture(initialBalance: number) {
    const inner = async () => {
        const [owner, otherAccount] = await ethers.getSigners();
        const ShalukeToken = await ethers.getContractFactory('ShalukeToken');

        // TODO add name for the contract, other init params?
        const shalukeToken = await ShalukeToken.deploy(ethers.utils.parseUnits(String(initialBalance), 'ether'));

        return { shalukeToken, owner, otherAccount };
    };

    return inner;
}

describe('transfer', () => {
    it('should fail to transfer if balance is zero', async () => {
        const { shalukeToken, owner, otherAccount } = await loadFixture(deployShalukeFixture(0));
        const res = await shalukeToken.transfer(otherAccount.address, ethers.utils.parseUnits('100', 'ether'));

        await expect(res).to.not.emit(shalukeToken, 'Transfer');
    });

    it('should fail to transfer if balance is not sufficient', async () => {
        const { shalukeToken, owner, otherAccount } = await loadFixture(deployShalukeFixture(500));
        const res = await shalukeToken.transfer(otherAccount.address, ethers.utils.parseUnits('1001', 'ether'));

        await expect(res).to.not.emit(shalukeToken, 'Transfer');
    });

    it('should emit an event when transfer is under initial balance', async () => {
        const { shalukeToken, owner, otherAccount } = await loadFixture(deployShalukeFixture(1000));

        const amount = ethers.utils.parseUnits('100', 'ether');

        const res = await shalukeToken.transfer(otherAccount.address, amount);
        await expect(res).to.emit(shalukeToken, 'Transfer').withArgs(owner.address, otherAccount.address, amount);
    });
});
