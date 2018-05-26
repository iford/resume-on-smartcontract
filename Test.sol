pragma solidity ^0.4.17;

contract Test{

    struct Info{
    		string name;
    		string dateOfBirth;
    		string myAddress;
    }

  	struct Skill{
  		  string skill;
  		  uint level;
  	}

    struct User{
      	Info info;
     		Skill skill;
    }

    mapping (uint => User) public users;
    uint indexCount;

    event infoEvent( string name, string dateOfBirth, string myAddress);
    event skillEvent( string skill, uint level);

    function getUserByIndex(uint index) public{
        Info memory _info = users[ index ].info;
        emit infoEvent( _info.name, _info.dateOfBirth, _info.myAddress );

        Skill memory _skill = users[ index ].skill;
        emit skillEvent( _skill.skill, _skill.level);
    }

    function setUser() public{
      indexCount++;
      users[indexCount] = User(Info("Ford","1-7-18","Bkk"),Skill("solidity",1));

    }

}
