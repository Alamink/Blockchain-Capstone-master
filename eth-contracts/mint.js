const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const MNEMONIC = ""//removed
const INFURA_KEY = "rinkeby.infura.io/v3/" // removed key
const NFT_CONTRACT_ADDRESS = "0x707951EaA2A635690eb5c818a3F6660cB359aAE2"
const OWNER_ADDRESS = "0xA379a662fcE14d8a37730B2C0f6b79B1924990b0"
const MENT_OWNER_ADDRESS = "0xA379a662fcE14d8a37730B2C0f6b79B1924990b0"
var proofs = require("./proofFol/proofs.json");

const NFT_ABI = require("./build/contracts/SolnSquareVerifier.json").abi; 

// const NETWORK = "rinkeby"

// const NUM_CREATURES = 12
// const NUM_LOOTBOXES = 4
// const DEFAULT_OPTION_ID = 0
// const LOOTBOX_OPTION_ID = 2

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS) {
    console.error("Please set a mnemonic, infura key, owner, and contract address.")
    return
}


async function main() {
    // console.log(NFT_ABI);
    // console.log(proofs);
    // console.log(proofs.length);
    const provider = new HDWalletProvider(MNEMONIC, `https://${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )
        // console.log(await provider);
        // console.log(await web3Instance);
    if (NFT_CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, {
            from: OWNER_ADDRESS,
            gasLimit: "1000000" })
        // Creatures issued directly to the owner.
        for (var i = 0; i <proofs.length ; i++) {
            console.log("minting token # "+ (i+1))
            // console.log("proof # "+ proofs[i].proof.a);
            // function mintNFT(address _owner, uint256 token, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
            // const result = await nftContract.methods.mintTo(OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
            try{
            let result = await nftContract.methods.mintNFT(MENT_OWNER_ADDRESS,(i+1),proofs[i].proof.a,proofs[i].proof.b,proofs[i].proof.c,proofs[i].inputs)
            .send({from:OWNER_ADDRESS});
            console.log("Minted creature. Transaction: " + result.transactionHash )
            }catch(e){
                console.log("erro happend during minting : "+ e)
                return process.exit(-1);
            }
        }
    } 
    return process.exit(0);
}
main()