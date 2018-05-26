// var jsmnSolLib = artifacts.require("./JsmnSolLib.sol");
var myResume = artifacts.require("./ResumeContract.sol");

module.exports = function(deployer) {
  // deployer.deploy(jsmnSolLib);
  // deployer.link(jsmnSolLib, myResume);
  deployer.deploy(myResume);
};
