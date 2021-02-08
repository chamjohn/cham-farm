const utils = require('./utils')
const StrategyController = artifacts.require("StrategyController")
const Vault = artifacts.require("Vault")
const UsdtVault = artifacts.require("Vault")
const WethVault = artifacts.require("Vault")
const SushiWethUsdtVault = artifacts.require("Vault")
const CurveRenbtcWbtcVault = artifacts.require("Vault")

SUB_KEY = "farm"
CONTROLLER = "controller"
VAULTS = "vaults"
USDT = "usdt"
CUSDT = "cerc20_delegator_usdt"

module.exports = async function (deployer, network, accounts) {
    console.log("3_deploy_vault.js, network: ", network)
    let deployedConfig = utils.getConfigContractAddresses();
    let config = utils.getContractAddresses();
    
    if (network == "main_fork") {
        // deploy vaults
        config[network][SUB_KEY][VAULTS] = {}
        // deploy usdt vault
        {
            await deployer.deploy(UsdtVault, {from: accounts[0]});
            config[network][SUB_KEY][VAULTS][USDT] = UsdtVault.address;
            let usdtVault = await Vault.at(config[network][SUB_KEY][VAULTS][USDT])
            await usdtVault.initialize(
                deployedConfig.mainnet.usdt,
                config[network][SUB_KEY][CONTROLLER],
                accounts[0],
                accounts[0],
                false,
                "",
                "",
                {from: accounts[0]}
            );
            await usdtVault.approveContractAccess(config[network][CUSDT], {from: accounts[0]});
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