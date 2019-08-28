pragma solidity ^0.5.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Oraclize.sol";

import "./ERC721Mintable.sol";
import "./verifier.sol";
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is AlaminERC721Token{

    Verifier private _verifier;
constructor(address verifierAddress) public {
        _verifier = Verifier(verifierAddress);
    }

// TODO define a solutions struct that can hold an index & an address
struct Solution{
    uint index;
    address owner;
}

// TODO define an array of the above struct
Solution[] private solutions;

// TODO define a mapping to store unique solutions submitted
mapping(bytes32 => bool ) private uniqueSolutions;


// TODO Create an event to emit when a solution is added

event SolutionAdded(bytes32 hashKey, string message);

// TODO Create a function to add the solutions to the array and emit the event
function addSloution(bytes32 hashKey,uint _index, address _owner) internal{
    solutions.push(Solution({ index: _index, owner: _owner}));
    uniqueSolutions[hashKey] = true;
    emit SolutionAdded(hashKey,"sloution for the key has been added");
}
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

function mintNFT(address _owner, uint256 token, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
public
returns(bool)
{
    bytes32 hashKey = keccak256(abi.encodePacked(a,b,c, input));
    require(uniqueSolutions[hashKey] == false,"Solution is already used");
    require(_verifier.verifyTx(a,b,c,input), "solution is not verified");
    // good to go  and mint the token
    addSloution(hashKey,token, _owner);
    return super.mint(_owner,token,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/");
}

}
























