const ethers = require("ethers");
const fs = require("fs");
// load the file we've created with global variables
const global_vars = require('./variables.json')

// get the compiled contract from disk
const compiledContractJSON = JSON.parse(fs.readFileSync(global_vars.compiledContractAsJSONLocation, 'utf8'));
// get the contract's abi
const contractAbi = JSON.stringify(compiledContractJSON.abi);
// Setup an ethers provider, which is a class that provides an abstraction for a connection
// to the blockchain
const provider = new ethers.providers.AlchemyProvider("rinkeby", global_vars.alchemyApiKey);

// Declare the contract object
const theContract = new ethers.Contract(global_vars.contractAddress, contractAbi, provider);


async function authorizeTheMinter() {

    let ownerWallet = new ethers.Wallet.fromMnemonic(global_vars.contractOwnerMnemonic)
    let connectedOwnerWallet = ownerWallet.connect(provider)

    // setup a connection to the contract that can execute fuctnions AS the contract owner.
    const contractAsOwner = theContract.connect(connectedOwnerWallet);

    // call the smart contract function that authorizes an address for a role
    console.log(await contractAsOwner.grantRole(global_vars.minterRoleAsBytes, global_vars.addressOfMinter))
    console.log("Check if Minter role was assigned.")
    console.log("Minter role was authorized for EOA: ")
    console.log(global_vars.addressOfMinter)
    console.log("with status:")
    console.log(await theContract.hasRole(ethers.utils.id("MINTER_ROLE"), global_vars.addressOfMinter))
}

authorizeTheMinter()


