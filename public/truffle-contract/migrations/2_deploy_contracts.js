var IssuingAuthority = artifacts.require("IssuingAuthority");
var Sharing = artifacts.require("Sharing");
var SuperUser = artifacts.require("SuperUser");

module.exports = function(deployer) {
  //deployer.deploy(IssuingAuthority);
  //deployer.deploy(Sharing);
  deployer.deploy(SuperUser);
};
