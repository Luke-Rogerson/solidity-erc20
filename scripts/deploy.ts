import { ethers } from 'hardhat';

async function main() {
    const ShalukeToken = await ethers.getContractFactory('ShalukeToken');
    const shalukeToken = await ShalukeToken.deploy(ethers.utils.parseUnits(String(1_000_000_000), 'ether'));

    await shalukeToken.deployed();

    console.log(`shalukeToken deployed to ${shalukeToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
