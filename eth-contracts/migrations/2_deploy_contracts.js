// migrating the appropriate contracts
var mycontract = artifacts.require("./AlaminERC721Token")
var SquareVerifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async function(deployer, network) {
  if(network == "development")
  await deployer.deploy(mycontract);

  await deployer.deploy(SquareVerifier);
  let verifer = await SquareVerifier.deployed();
  await deployer.deploy(SolnSquareVerifier, verifer.address);
};
