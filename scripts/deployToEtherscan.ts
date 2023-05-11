import { ethers, run } from 'hardhat';

async function main() {
    console.log(`Verifying contract on Etherscan...`);

    await run(`verify:verify`, {
        address: '0x17f0774EDBB26009b296BCdE16F18beEbF0D2e04',
        constructorArguments: [ethers.utils.parseUnits(String(1_000_000_000), 'ether')],
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
