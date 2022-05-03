const ethers = require("ethers");
const fs = require("fs");
// get arguments from the cli
var argumentsPassedToScript = process.argv.slice(2);
// load the file we've created with global variables
const global_vars = require('./variables.json')


const eoa = argumentsPassedToScript[0]
const tokenId = argumentsPassedToScript[1]


// get the compiled contract from disk
const compiledContractJSON = JSON.parse(fs.readFileSync(global_vars.compiledContractAsJSONLocation, 'utf8'));
// get the contract's abi
const contractAbi = JSON.stringify(compiledContractJSON.abi);
// Setup an ethers provider, which is a class that provides an abstraction for a connection
// to the blockchain
const provider = new ethers.providers.AlchemyProvider("rinkeby", global_vars.alchemyApiKey);

// Declare the contract object
const theContract = new ethers.Contract(global_vars.contractAddress, contractAbi, provider);


async function getBalanceOf(address, tokenid) {

    // call the smart contract function
    let resBal = await theContract.balanceOf(address, tokenid)
    console.log(resBal.toNumber())
}

getBalanceOf(eoa, tokenId)