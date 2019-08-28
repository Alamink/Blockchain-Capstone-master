var ERC721MintableComplete = artifacts.require('AlaminERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2]
    const URL = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"
    const eventPaused = "Paused"
    const eventUnpaused = "Unpaused"
    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two,1,URL);
            await this.contract.mint(account_two,2,URL);
            await this.contract.mint(account_three,3,URL);
        })
        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            // console.log("totalsupply : "+totalSupply);
            assert.equal(totalSupply, 3, 'Total supply should be 3');
        })
        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(account_two);
            // console.log("balance : "+balance);
            assert.equal(balance, 2, 'Balance should be 2');
             balance = await this.contract.balanceOf(account_three);
            assert.equal(balance, 1, 'Balance should be 1');             
        })
        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenUrl = await this.contract.tokenURI(1);
            assert.equal(tokenUrl, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", 'Invalid Token URL');
             tokenUrl = await this.contract.tokenURI(2);
            assert.equal(tokenUrl, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", 'Invalid Token URL');
            tokenUrl = await this.contract.tokenURI(3);
            assert.equal(tokenUrl, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3", 'Invalid Token URL');
        })
        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two,account_three,1 , {from:account_two});
            var newOwner = await this.contract.ownerOf(1);
            assert.equal(account_three, newOwner , "account two should be the owner ");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let result = false;
            try{
               await this.contract.mint(account_two,1,URL, {from:account_three});
            }catch(e){
                result = true;
            }
            assert.equal(result, true , "should fail as only owner can mint token");
        })

        it('should return contract owner', async function () { 
            let ownerOfContract = await this.contract.owner();
            assert.equal(ownerOfContract, account_one , "owner should be account one");
        })        
        it("should return name", async function(){
            let name = await this.contract.name();
            assert.equal(name, "Alamin Almatrudi" , "Invalid name");

        });
        it("should return symbol", async function(){
            let symbol =  await this.contract.symbol();
            assert.equal(symbol, "AKA" , "Invalid symbol");

        });
        it("should return baseTokenURI", async function(){
            let baseUrl = await this.contract.baseTokenURI();
            assert.equal(baseUrl, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" , "Invalid URL");

        });
        it("test for transfer of ownership",async function(){
          await this.contract.transferOwnership(account_two);
           assert.equal(await this.contract.owner(), account_two, "New owner should have the ownership");
        });
        it("test for transfer of ownership when not owner try to transfer ownership", async function(){
            let result = false;
            try{
             await this.contract.transferOwnership(account_three, {from : account_two});
            }catch(e){
                result = true;
            }
            assert.equal(result, true , "should fail as only owner can transfer ownership");
            assert.equal(await this.contract.owner(), account_one, "owner should still be account_one");
            await this.contract.transferOwnership(account_three, {from:account_one});
            assert.equal(await this.contract.owner(), account_three, "owner be account_three");
        });
    });
    describe("Additional test for functionality", function(){
        beforeEach(async function(){
            this.contract = await ERC721MintableComplete.new({from: account_one});
            await this.contract.mint(account_two,1,URL);

        });
        it("test for pause by contract owner", async function(){
            let event = await this.contract.setPause(true);  
            let eventEmitted = event.logs[0].event;  
            assert.equal(eventEmitted,eventPaused,"Invalid event emiteed");
            event = await this.contract.setPause(false);  
            eventEmitted = event.logs[0].event;  
            assert.equal(eventEmitted,eventUnpaused,"Invalid event emiteed");
        })
        it("test for pause contract not by owner", async function(){
            let result = false;
            try{
                await this.contract.setPause(true, {from:account_three});    
            }catch(e){
                result = true;
            }
            assert.equal(result, true , "should not allow non-owner to change the state of pause");
        });
        it("test for set approval", async function(){
            await this.contract.approve(account_three,1);
            assert.equal(await this.contract.getApproved(1),account_three,"Error : did not aprrove account_three");
        });
    })
})