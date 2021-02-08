const utils = require('./utils')
const StrategyController = artifacts.require("StrategyController")
const Vault = artifacts.require("Vault")
const UsdtVault = artifacts.require("Vault")
const WethVault = artifacts.require("Vault")
const SushiWethUsdtVault = artifacts.require("Vault")
const CurveRenbtcWbtcVault = artifacts.require("Vault")
const StrategyCompoundV1 = artifacts.require("StrategyCompoundV1")
const StrategyUsdt = artifacts.require("StrategyCompoundV1")
const StrategySushiWethUsdt = artifacts.require("StrategyCompoundV1")


SUB_KEY = "farm"
CONTROLLER = "controller"
VAULTS = "vaults"
USDT = "usdt"
COMP_CONTROLLER = "unitroller"
CUSDT = "cerc20_delegator_usdt"
STRATEGIES = "strategies"

module.exports = async function (deployer, network, accounts) {
    console.log("4_deploy_strategy.js, network: ", network)
    let deployedConfig = utils.getConfigContractAddresses();
    let config = utils.getContractAddresses();
    
    if (network == "main_fork") {
        // load controller 
        let controller = await StrategyController.at(config[network][SUB_KEY][CONTROLLER])

        // deploy strategy
        config[network][SUB_KEY][STRATEGIES] = {}
        // deploy usdt compound strategy
        {
            await deployer.deploy(StrategyUsdt, {from: accounts[0]});
            config[network][SUB_KEY][STRATEGIES][USDT] = StrategyUsdt.address;
            let usdtStrategy = await StrategyCompoundV1.at(config[network][SUB_KEY][STRATEGIES][USDT])
            await usdtStrategy.initialize(
                accounts[0],
                accounts[0],
                config[network][SUB_KEY][CONTROLLER],
                accounts[0],
                accounts[0],
                config[network][COMP_CONTROLLER],
                config[network][CUSDT],
                {from: accounts[0]}
            );
            await controller.approveStrategy(deployedConfig.mainnet.usdt, config[network][SUB_KEY][STRATEGIES][USDT])
            await controller.setVault(deployedConfig.mainnet.usdt, config[network][SUB_KEY][VAULTS][USDT])
            await controller.setStrategy(deployedConfig.mainnet.usdt, config[network][SUB_KEY][STRATEGIES][USDT]);
        }
        // TODO: deploy weth vault
        // TODO: deploy sushi_weth_usdt vault
        // TODO: deploy curve_renbtc_wbtc
        
        
        // save config
        utils.writeContractAddresses(config);
    } else {
        return
    }
    
}