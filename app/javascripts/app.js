// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "bootstrap/dist/css/bootstrap.css";
// import "mustache/mustache.min.js";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import { default as mustache} from 'mustache';

// Import our contract artifacts and turn them into usable abstractions.
import resume_artifacts from '../../build/contracts/ResumeContract.json'

var resume = contract(resume_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {

    resume.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      App.refreshResumeInfo();
      App.eventPersonalInfoListener();
      // App.addInfo();

    });
  },

  addInfo: function() {
    resume.deployed().then(function(instance) {
      return instance.addPersonalInfo("https://goo.gl/X2LQwx", "Ford Weera","0843694750","Ford@gmail.com","1-7-1988","github.com/iford","Mobile Dev","Rama2 Bkk",{from: accounts[0], gas: 3000000});
    }).then(function(value) {
      console.log("addInfo:"+value);
      App.refreshResumeInfo();
    }).catch(function(e) {
      console.log(e);

    });
  },

  refreshResumeInfo: function() {
    resume.deployed().then(function(instance) {
      return instance.triggerGetResumeByEvent(account, {from: account, gas:3000000});
    }).then(function(value) {

    }).catch(function(e) {
      console.log(e);

    });
  },

  createTemplate: function(templateId, parentId, data) {
    var template = document.getElementById(templateId).innerHTML;
    mustache.parse(template);
    var rendered = mustache.render(template, data);
    var parentElement = document.getElementById(parentId);
    parentElement.insertAdjacentHTML("afterend",rendered);

  },

  eventPersonalInfoListener: function(){
    resume.deployed().then(function(instance){
        var event =  instance.personalInfoEvent({}, {fromBlock:0, toBlock:'latest'});
        event.watch(function(error, result){
          if(!error){
            console.log("personalInfo",result);
            document.getElementById("profilePic").src = web3.toAscii( result.args.picUrl );
            document.getElementById("name").innerHTML = web3.toAscii( result.args.name );
            document.getElementById("phone").innerHTML = web3.hexToAscii( web3.toHex(result.args.phone) );
            document.getElementById("email").innerHTML = web3.toAscii(result.args.email);
            document.getElementById("dateOfBirth").innerHTML = web3.toAscii( result.args.dateOfBirth);
            document.getElementById("socialUrl").innerHTML = web3.toAscii( result.args.url);
            document.getElementById("currentPosition").innerHTML = web3.toAscii( result.args.position );
            document.getElementById("address").innerHTML =  result.args.location;

          }
        });
    });
  },

  eventExperienceListener: function(){
        var expArr;
        resume.deployed().then(function(instance){
            var event =  instance.experienceEvent({}, {fromBlock:0, toBlock:'latest'});
            event.watch(function(error, result){
              if(!error){

              }
            });
     });

  },

  eventEducationListener: function(){
        var eduArr;
        resume.deployed().then(function(instance){
            var event =  instance.educationEvent({}, {fromBlock:0, toBlock:'latest'});
            event.watch(function(error, result){
              if(!error){

              }
            });
     });

  },

  eventSkillEventListener: function(){
        var skillArr;
        resume.deployed().then(function(instance){
            var event =  instance.skillEvent({}, {fromBlock:0, toBlock:'latest'});
            event.watch(function(error, result){
              if(!error){

              }
            });
     });

  },

  eventInterestEventListener: function(){
        var interestArr;
        resume.deployed().then(function(instance){
            var event =  instance.skillEvent({}, {fromBlock:0, toBlock:'latest'});
            event.watch(function(error, result){
              if(!error){

              }
            });
     });

  },

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
