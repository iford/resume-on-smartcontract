pragma solidity ^0.4.17;

import "./Owned.sol";

contract ResumeContract is Owned {

	function ResumeContract() public{

	}

	struct PersonalInfo{
		bytes32 name;
		bytes32 phone;
		bytes32 email;
		bytes32 dateOfBirth;
		bytes32 socialUrl;
		bytes32 currentPosition;
		string localtion;
	}

	struct Experience{
		bytes32 startDate;
		bytes32 endDate;
		bytes32 companyName;
		bytes32 position;
		bool isNotEmpty;
	}

	struct Education{
		bytes32 institute;
		bytes32 degree;
		bytes32 faculty;
		bytes32 major;
		bytes32 gpa;
		bool isNotEmpty;
	}

	enum SkillLevel{
		advanced,
		medium,
		basic
	}

	struct Skill{
		bytes32 _skill;
		SkillLevel level;
		bool isNotEmpty;
	}

	struct ResumeModel{
		PersonalInfo personalInfo;
		Experience[] experiences;
		Education[] educations;
		Skill[] skills;
		string[] Interests;
		bool isNotEmpty;

	}

	mapping (address => ResumeModel) mResumeModels;

	uint mVersion;
	uint[] mAllVersion;


	function getCurrentVersion() public view returns(uint){
		return mVersion;
	}

	event personalInfoEvent(bytes32 name,
													bytes32 phone,
													bytes32 email,
													bytes32 dateOfBirth,
													bytes32 url,
													bytes32 position,
													string localtion);

	function triggerPersonalInfoEvent(address _version) public {

		if(!mResumeModels[_version].isNotEmpty){
			PersonalInfo memory info;
			info = mResumeModels[_version].personalInfo;
			emit personalInfoEvent( info.name,
															info.phone,
															info.email,
 															info.dateOfBirth,
 															info.socialUrl,
															info.currentPosition,
															info.localtion );
		}
	}

	event experienceEvent(bytes32 startDate,
												bytes32 endDate,
												bytes32 companyName,
												bytes32 position,
 												uint index);

	function triggerExperienceEvent(uint _version) public  {
		if(!mResumeModels[_version].isNotEmpty){
				Experience[] memory expList;
				expList = mResumeModels[_version].experiences;

				for(uint i=0; i < expList.length; i++){
					Experience memory exp = expList[i];
					emit experienceEvent(	exp.startDate,
																exp.endDate,
																exp.companyName,
																exp.position ,
																i );
				}
			}
		}

	event educationEvent(	bytes32 institute,
												bytes32 degree,
												bytes32 faculty,
												bytes32 major,
												bytes32 gpa,
 												uint index);

	function triggerEducationEvent(uint _version) public  {
		if(!mResumeModels[_version].isNotEmpty){
			Education[] memory eduList;
			eduList = mResumeModels[_version].educations;

			for(uint i=0; i < eduList.length; i++){
				Education memory edu = eduList[i];
				emit educationEvent(edu.institute,
														edu.degree,
														edu.faculty,
														edu.major,
														edu.gpa,
														i );
			}
		}
	}

	event skillEvent(	bytes32 skill,
										bytes32 level,
										uint index );

	function triggerSkillEvent(uint _version) public  {
		if(!mResumeModels[_version].isNotEmpty){
			Skill[] memory skillList;
			skillList = mResumeModels[_version].skills;

			for(uint i=0; i < skillList.length; i++){
				Skill memory skill = skillList[i];
				bytes32 lvl = "";
				if(skill.level == SkillLevel.advanced){
					lvl = "advanced";
				}else if(skill.level == SkillLevel.medium){
					lvl = "medium";
				}else if(skill.level == SkillLevel.basic){
					lvl = "basic";
				}

				emit skillEvent(skill._skill, lvl, i);
			}
		}
	}

	function setPersonalInfo() public {

	}

}
