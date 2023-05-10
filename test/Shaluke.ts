import { ethers } from 'hardhat';
import { Contract } from 'hardhat/internal/hardhat-network/stack-traces/model';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

async function deployShalukeFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const ShalukeToken = await ethers.getContractFactory('ShalukeToken');
    // TODO add name for the contract, other init params?
    const shalukeToken = await ShalukeToken.deploy();

    return { shalukeToken, owner, otherAccount };
}

describe('transfer', () => {
    it('should fail to transfer if balance is zero', async () => {
        const { shalukeToken, owner, otherAccount } = await loadFixture(deployShalukeFixture);

        const res = await shalukeToken.transfer(otherAccount.address, 100);
        console.log('res :', res);

        expect(res.value).to.be.false;
        console.log(res.value.toNumber());
        expect(await shalukeToken.transfer(otherAccount.address, 1)).to.equal(false);
    });

    it('should fail to transfer if balance is zero TEMP', async () => {
        const { shalukeToken, owner, otherAccount } = await loadFixture(deployShalukeFixture);
        expect(await shalukeToken.transfer(otherAccount.address, 1)).to.equal(true);
    });
});
