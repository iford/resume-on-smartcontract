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

const  SKILL_LEVEL_ADVANCED = "advanced";
const  SKILL_LEVEL_BASIC = "basic";
const  SKILL_LEVEL_MEDIUM = "medium";
const  SKILL_LEVEL_NOTSET = "";

window.App = {
  start: function() {

    resume.setProvider(web3.currentProvider);
    if (typeof resume.currentProvider.sendAsync !== "function") {
    resume.currentProvider.sendAsync = function() {
        return resume.currentProvider.send.apply(
            resume.currentProvider, arguments
        );
    };
    }


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


    });
  },

  refreshResumeInfo: function() {
    resume.deployed().then(function(instance) {
      return instance.triggerGetResumeByEvent(account, {from: account, gas:3000000});

    }).then(function(value) {
      App.eventPersonalInfoListener();
      App.eventExperienceListener();
      App.eventEducationListener();
      App.eventSkillEventListener();
      App.eventInterestEventListener();

    }).catch(function(e) {
      console.log(e);

    });
  },

  createTemplate: function(templateId, parentId, data) {
    console.log("createTemplate");
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
            App.updatePersonalInfoView(result.args);
            event.stopWatching();
            // console.log("Personal Info = "+result);
          }else {
            console.error(error);
          }
        });
    });
  },

  updatePersonalInfoView: function(data){
    if(data !== 'undefined' ){
      document.getElementById("profilePic").src = web3.utils.toAscii( data.picUrl );
      document.getElementById("name").innerHTML = web3.utils.toAscii( data.name );
      document.getElementById("phone").innerHTML = web3.utils.hexToAscii( data.phone );
      document.getElementById("email").innerHTML = web3.utils.toAscii( data.email );
      document.getElementById("dateOfBirth").innerHTML = web3.utils.toAscii( data.dateOfBirth );
      document.getElementById("socialUrl").innerHTML = web3.utils.toAscii( data.url );
      document.getElementById("currentPosition").innerHTML = web3.utils.toAscii( data.position );
      document.getElementById("address").innerHTML =  data.location;
    }else {
      console.error(data);
    }
  },

  eventExperienceListener: function(){

        resume.deployed().then(function(instance){
            var expArr = [];
            var event =  instance.experienceEvent({}, {fromBlock:'latest', toBlock:'latest'});
            event.watch(function(error, result){

              if(!error){
                // console.log( "Experience result =", result );

                var count = result.args.count.toNumber();
                var index = result.args.index.toNumber();
                expArr[index] = result.args;

                var isLastIndex = (count == index+1);
                if(isLastIndex){
                  event.stopWatching();
                  App.updateExperienceView( expArr );
                }
              }
            });
     });

  },

  updateExperienceView: function(data){
    if(data !== 'undefined' ){
      var list = [];
      for(var i=0; i< data.length; i++){
        list[i] = {"startDate": web3.utils.toAscii(data[i].startDate), "endDate": web3.utils.toAscii( data[i].endDate ), "position": web3.utils.toAscii( data[i].companyName ), "company":web3.utils.toAscii( data[i].position ), "expText": data[i].expText  };
      }
      var epxData = {"experienceList":list};
      App.createTemplate("experienceTemplate","experienceContainer", epxData);

    }else {
      console.error(data);
    }
  },

  eventEducationListener: function(){

        resume.deployed().then(function(instance){
            var eduArr = [];
            var event =  instance.educationEvent({}, {fromBlock:"latest", toBlock:'latest'});
            event.watch(function(error, result){
              if(!error){

                var count = result.args.count.toNumber();
                var index = result.args.index.toNumber();
                console.log( "count =",count );
                console.log( "index =",index );
                console.log("eventEducation result = ",result);
                eduArr[index] = result.args;

                var isLastIndex = (count == index+1);
                if(isLastIndex){
                  event.stopWatching();
                  App.updateEducationView( eduArr );
                }
              }
            });
     });

  },


  updateEducationView: function(data){
    if(data !== 'undefined' ){

      var list = [];
      for(var i=0; i< data.length; i++){

        list[i] = { "startDate": web3.utils.toAscii(data[i].startDate),
                    "endDate": web3.utils.toAscii( data[i].endDate ),
                    "institute": web3.utils.toAscii( data[i].institute ),
                    "degree":web3.utils.toAscii( data[i].degree ),
                    "faculty":web3.utils.toAscii( data[i].faculty ),
                    "major":web3.utils.toAscii( data[i].major ),
                    "gpa":web3.utils.toAscii( data[i].gpa )};
      }
      var epxData = {"educationList":list};
      App.createTemplate("educationTemplate", "educationContainer", epxData);

    }else {
      console.error(data);
    }
  },

  eventSkillEventListener: function(){

        resume.deployed().then(function(instance){
            var skillArr = [];
            var event =  instance.skillEvent({}, {fromBlock:'latest', toBlock:'latest'});
            event.watch(function(error, result){
              if(!error){
                var count = result.args.count.toNumber();
                var index = result.args.index.toNumber();
                skillArr[index] = result.args;

                var isLastIndex = (count == index+1);
                if(isLastIndex){
                  event.stopWatching();
                  App.updateSkillView( skillArr );
                }
              }
            });
     });

  },

  updateSkillView: function(data){
    if(data !== 'undefined' ){
      var list = [];
      for(var i=0; i< data.length; i++){
        list[i] = { "_skill": web3.utils.toAscii( data[i].skill ),
                    "level": web3.utils.toAscii( data[i].level ) };
      }
      var skillData = {"skillList":list};
      App.createTemplate("skillTemplate", "skillsContainer", skillData);

    }else {
      console.error(data);
    }
  },

  eventInterestEventListener: function(){

        resume.deployed().then(function(instance){
            var interestArr = [];
            var event =  instance.interestEvent({}, {fromBlock:'latest', toBlock:'latest'});
            event.watch(function(error, result){
              if(!error){
                var count = result.args.count.toNumber();
                var index = result.args.index.toNumber();
                console.log( "count =",count );
                console.log( "index =",index );
                console.log("event interest result = ",result);
                interestArr[index] = result.args;

                var isLastIndex = (count == index+1);
                if(isLastIndex){
                  event.stopWatching();
                  App.updateInterestView( interestArr );
                }
              }
            });
     });
  },

  updateInterestView: function(data){
    if(data !== 'undefined' ){
      var list = [];
      for(var i=0; i< data.length; i++){
        list[i] = { "interest": web3.utils.toAscii( data[i].interest ) };
      }
      var interestData = {"interestList":list};
      App.createTemplate("interestTemplate", "interestsContainer", interestData);

    }else {
      console.error(data);
    }
  },

/*----- test add info------*/

  testAddInfo: function() {
    resume.deployed().then(function(instance) {
      /*return instance.addEducation( web3.utils.toHex("2014-08"),
                                    web3.utils.toHex("2018-08"),
                                    web3.utils.toHex("CU"),
                                    web3.utils.toHex("Master degree"),
                                    web3.utils.toHex("Mass Communication"),
                                    web3.utils.toHex("Multimedia Technology"),
                                    web3.utils.toHex("GPA 3.44"),{from: accounts[0], gas: 3000000});*/

      /*return instance.addSkill(     web3.utils.toHex("C++"),
                                    web3.utils.toHex(SKILL_LEVEL_ADVANCED),
                                    {from: accounts[0], gas: 3000000});*/

      return instance.addInterest(  web3.utils.toHex("Traveler"),
                                    {from: accounts[0], gas: 3000000});
      // return instance.addExperience("2012-01","2014-08","KBTS","blockchain Dev", "Developed  Application With solidity",{from: accounts[0], gas: 3000000});
      // return instance.addPersonalInfo("https://goo.gl/X2LQwx", "Ford Weera", "084-3694750","Ford@gmail.com","1-7-1988","github.com/iford","Mobile Dev","20/46 Smart Condo Rama2, Khwaeng Samae Dam, Khet Bang Khun Thian, Bangkok 10150",{from: accounts[0], gas: 3000000});
    }).then(function(value) {
      console.log("addInfo:" + JSON.stringify( value ));
      App.refreshResumeInfo();
    }).catch(function(e) {
      console.log(e);

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
