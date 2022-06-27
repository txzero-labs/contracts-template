import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import verify from '../helpers/verify-contract';
import 'dotenv/config';
import { DEVELOPMENT_CHAINS } from '../helpers/constants';

const NAME = process.env.NAME || '';
const SYMBOL = process.env.SYMBOL || '';
const BASE_URI = process.env.BASE_URI || '';
const CONTRACT_NAME = process.env.CONTRACT_NAME || '';

const deployBronzeTierCollection: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`Deploying ${CONTRACT_NAME} Contract and awaiting for confirmations...`);
  const contract = await deploy(CONTRACT_NAME, {
    from: deployer,
    args: [NAME, SYMBOL, BASE_URI],
    log: true,
    // TODO: Read for every blockchain config
    // 1 - for testing purposes / when calling tests
    waitConfirmations: 5,
  });

  log(`${CONTRACT_NAME} Contract at ${contract.address}`);
  if (!DEVELOPMENT_CHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(contract.address, [
      NAME,
      SYMBOL,
      BASE_URI,
    ]);
  }
}

export default deployBronzeTierCollection;
deployBronzeTierCollection.tags = ['all', CONTRACT_NAME];