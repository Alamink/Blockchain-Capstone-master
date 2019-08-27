// migrating the appropriate contracts
var mycontract = artifacts.require("./AlaminERC721Token")
// var SquareVerifier = artifacts.require("./SquareVerifier.sol");
// var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(mycontract);
  // deployer.deploy(SquareVerifier);
  // deployer.deploy(SolnSquareVerifier);
};
