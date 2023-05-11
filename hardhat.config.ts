import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
    solidity: '0.8.18',
    networks: {
        ethmainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [process.env.PRIVATE_KEY as string],
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY as string,
    },
};

export default config;
