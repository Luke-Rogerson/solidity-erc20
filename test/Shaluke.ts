import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

function deployShalukeFixture(initialBalance: number) {
    const inner = async () => {
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
        const ShalukeToken = await ethers.getContractFactory('ShalukeToken');

        // TODO add name for the contract, other init params?
        const shalukeToken = await ShalukeToken.deploy(ethers.utils.parseUnits(String(initialBalance), 'ether'));

        return { shalukeToken, owner, otherAccount, thirdAccount };
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

describe('balanceOf', () => {
    it('should return the initial balance for deployer', async () => {
        const { shalukeToken, owner } = await loadFixture(deployShalukeFixture(500));
        expect(await shalukeToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits('500', 'ether'));
    });
    it('should return the initial balance for non-deployer', async () => {
        const { shalukeToken, otherAccount } = await loadFixture(deployShalukeFixture(500));
        expect(await shalukeToken.balanceOf(otherAccount.address)).to.equal(0);
    });
    // This is combining unit and integaration tests functionality. Is this typical in Solidity?
    it('should reflect balance after transfer', async () => {
        const { shalukeToken, otherAccount, owner } = await loadFixture(deployShalukeFixture(500));
        await shalukeToken.transfer(otherAccount.address, ethers.utils.parseUnits('100', 'ether'));
        expect(await shalukeToken.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseUnits('100', 'ether'));
        expect(await shalukeToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits('400', 'ether'));
    });
});

describe('totalSupply', () => {
    it('should return the initial balance', async () => {
        const { shalukeToken } = await loadFixture(deployShalukeFixture(1000));

        const totalSupply = await shalukeToken.totalSupply();
        expect(totalSupply).to.equal(ethers.utils.parseUnits('1000', 'ether'));
    });
});

describe('approve', () => {
    it('should allow a user to approve another to spend on their behalf', async () => {
        const { shalukeToken, owner, otherAccount } = await loadFixture(deployShalukeFixture(1000));

        const res = shalukeToken.approve(otherAccount.address, ethers.utils.parseUnits('100', 'ether'));
        await expect(res)
            .to.emit(shalukeToken, 'Approval')
            .withArgs(owner.address, otherAccount.address, ethers.utils.parseUnits('100', 'ether'));
    });
});

// no allowance
// not enough allowance
// with enough allowance
describe('transferFrom', () => {
    it('should not allow a transfer when user has not setup an allowance for that user', async () => {
        const { shalukeToken, owner, otherAccount, thirdAccount } = await loadFixture(deployShalukeFixture(1000));

        const res = await shalukeToken
            .connect(otherAccount)
            .transferFrom(owner.address, thirdAccount.address, ethers.utils.parseUnits('100', 'ether'));

        await expect(res).to.not.emit(shalukeToken, 'Transfer');
    });

    it('should not allow a transfer when user does not have enough allowance', async () => {
        const { shalukeToken, owner, otherAccount, thirdAccount } = await loadFixture(deployShalukeFixture(1000));

        await shalukeToken.approve(otherAccount.address, ethers.utils.parseUnits('50', 'ether'));

        const res = await shalukeToken
            .connect(otherAccount)
            .transferFrom(owner.address, thirdAccount.address, ethers.utils.parseUnits('100', 'ether'));

        await expect(res).to.not.emit(shalukeToken, 'Transfer');
    });

    it('should allow a transfer when user has sufficient allowance', async () => {
        const { shalukeToken, owner, otherAccount, thirdAccount } = await loadFixture(deployShalukeFixture(1000));
        await shalukeToken.approve(otherAccount.address, ethers.utils.parseUnits('100', 'ether'));

        const res = await shalukeToken
            .connect(otherAccount)
            .transferFrom(owner.address, thirdAccount.address, ethers.utils.parseUnits('50', 'ether'));

        await expect(res)
            .to.emit(shalukeToken, 'Transfer')
            .withArgs(owner.address, thirdAccount.address, ethers.utils.parseUnits('50', 'ether'));
    });

    it('should reduce the allowance after a transfer', async () => {
        const { shalukeToken, owner, otherAccount, thirdAccount } = await loadFixture(deployShalukeFixture(1000));

        await shalukeToken.approve(otherAccount.address, ethers.utils.parseUnits('10', 'ether'));

        expect(
            await shalukeToken
                .connect(otherAccount)
                .transferFrom(owner.address, thirdAccount.address, ethers.utils.parseUnits('2', 'ether')),
        )
            .to.emit(shalukeToken, 'Transfer')
            .withArgs(owner.address, thirdAccount.address, ethers.utils.parseUnits('2', 'ether'));

        expect(
            await shalukeToken
                .connect(otherAccount)
                .transferFrom(owner.address, thirdAccount.address, ethers.utils.parseUnits('8', 'ether')),
        )
            .to.emit(shalukeToken, 'Transfer')
            .withArgs(owner.address, thirdAccount.address, ethers.utils.parseUnits('8', 'ether'));

        expect(
            await shalukeToken.connect(otherAccount).transferFrom(owner.address, thirdAccount.address, 1),
        ).to.not.emit(shalukeToken, 'Transfer');
    });
});
