const ethers = require("ethers");
const fs = require("fs");
// load the file we've created with global variables
const global_vars = require('./variables.json')


const nftRecipient1 = "0xE95Cea1a2A952a4087cd190501DDEA6CAFAb3665";
const nftRecipient2 = "0xAC5335a54490503Ed9B506CB5Bb4597EAFa40BBC";


// get the compiled contract from disk
const compiledContractJSON = JSON.parse(fs.readFileSync(global_vars.compiledContractAsJSONLocation, 'utf8'));
// get the contract's abi
const contractAbi = JSON.stringify(compiledContractJSON.abi);
// Setup an ethers provider, which is a class that provides an abstraction for a connection
// to the blockchain.
const provider = new ethers.providers.AlchemyProvider("rinkeby", global_vars.alchemyApiKey);

// Declare the contract object
const theContract = new ethers.Contract(global_vars.contractAddress, contractAbi, provider);


async function batchMintNfts() {

    let ownerWallet = new ethers.Wallet.fromMnemonic(global_vars.contractOwnerMnemonic)
    let connectedOwnerWallet = ownerWallet.connect(provider)

    // setup a connection to the contract that can execute fuctnions AS the contract owner.
    const contractAsOwner = theContract.connect(connectedOwnerWallet);

    // Create arrays for batch mint to recipient 1
    // 1 of each token
    const tokens1 = new Array(125);
    const amounts1 = new Array(125);
    for (var i = 0; i < 125; i++) {
        tokens1[i] = i + 1;
        amounts1[i] = 1;
    }
    console.log(tokens1)

    // Create arrays for batch mint to recipient 2
    // 1 of each token
    const tokens2 = new Array(125);
    const amounts2 = new Array(125);
    for (var i = 0; i < 125; i++) {
        tokens2[i] = i + 126;
        amounts2[i] = 1;
    }
    console.log(tokens2)

    // call the smart contract function to batch mint
    let resOfMinting1 = await contractAsOwner.mintBatch(nftRecipient1, tokens1, amounts1, 0x0)
    let resOfMinting2 = await contractAsOwner.mintBatch(nftRecipient2, tokens2, amounts2, 0x0)
    console.log(resOfMinting1)
    console.log(resOfMinting2)
}

batchMintNfts()