// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');


var proofs = require("../proofFol/proofs.json");
contract('TestSolnSquareVerifier', accounts => {
    
    const account_one = accounts[0];
    const account_two = accounts[1];


    //watch for SolutionAdded event
    const eventSolutionAdded = "SolutionAdded";

    describe('Test for Integration of verification and my token', function () {
        beforeEach(async function () { 
           this.verifer = await verifier.new({from: account_one});
           this.contract = await SolnSquareVerifier.new(this.verifer.address);
        });
        // Test if a new solution can be added for contract - SolnSquareVerifier
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test solution can be added for SolnSquareVerifier', async function () { 
            let proof1 = proofs[0];
        //  console.log(proof1);
            let event = await this.contract.mintNFT(account_two,1,proof1.proof.a,proof1.proof.b,proof1.proof.c,proof1.inputs);  
            let eventEmitted = event.logs[0].event;
            // let result = await this.contract.verifyTx.call(correctProof.proof.a,correctProof.proof.b,correctProof.proof.c,correctProof.inputs);
            assert.equal( eventEmitted, eventSolutionAdded, 'It should have fired an solution added event');        
        })
        it('Test token can be minted', async function () { 
            let proof1 = proofs[0];
            let result = await this.contract.mintNFT.call(account_two,1,proof1.proof.a,proof1.proof.b,proof1.proof.c,proof1.inputs);  
            assert.equal( result, true, 'It shoud mint a token');    
        })
        it('Test token can not be minted using same proof twice', async function () { 
            let proof1 = proofs[0];
            let result = true;
             await this.contract.mintNFT(account_two,1,proof1.proof.a,proof1.proof.b,proof1.proof.c,proof1.inputs);  
             try{
                 await this.contract.mintNFT(account_two,2,proof1.proof.a,proof1.proof.b,proof1.proof.c,proof1.inputs);  
             }catch(e){
                result = false;
             }
             assert.equal(result, false, 'It shoud not mint another token with same proof');    

        })

    })

    


})