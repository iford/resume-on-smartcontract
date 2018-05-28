pragma solidity ^0.4.17;

import "./Owned.sol";

contract ResumeContract is Owned {

	function ResumeContract() public{

	}

	struct PersonalInfo{
		bytes32 picUrl;
		bytes32 name;
		bytes32 phone;
		bytes32 email;
		bytes32 dateOfBirth;
		bytes32 socialUrl;
		bytes32 currentPosition;
		string location;
	}

	struct Experience{
		bytes32 startDate;
		bytes32 endDate;
		bytes32 companyName;
		bytes32 position;
		string expText;
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

	bytes32 constant SKILL_LEVEL_ADVANCED = "advanced";
	bytes32 constant SKILL_LEVEL_BASIC = "basic";
	bytes32 constant SKILL_LEVEL_MEDIUM = "medium";
	bytes32 constant SKILL_LEVEL_NOTSET = "";

	struct Skill{
		bytes32 _skill;
		bytes32 level;
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

	event ResumeEmptyEvent();

	function triggerGetResumeByEvent(address accountId) public {
		if(!mResumeModels[accountId].isNotEmpty){
			triggerGetPersonalInfoByEvent(accountId);
			triggerGetExperienceByEvent(accountId);
			triggerGetEducationByEvent(accountId);
			triggerGetSkillByEvent(accountId);
		}else{
			emit ResumeEmptyEvent();
		}
	}

	event personalInfoEvent(bytes32 picUrl,
													bytes32 name,
													bytes32 phone,
													bytes32 email,
													bytes32 dateOfBirth,
													bytes32 url,
													bytes32 position,
													string location);

	function triggerGetPersonalInfoByEvent(address accountId) public {

		if(!mResumeModels[accountId].isNotEmpty){
			PersonalInfo memory info;
			info = mResumeModels[accountId].personalInfo;
			emit personalInfoEvent(	info.picUrl,
 															info.name,
															info.phone,
															info.email,
 															info.dateOfBirth,
 															info.socialUrl,
															info.currentPosition,
															info.location );
		}
	}


	function addPersonalInfo(	bytes32 picUrl,
														bytes32 name,
														bytes32 phone,
														bytes32 email,
														bytes32 dateOfBirth,
														bytes32 url,
														bytes32 position,
														string location ) public returns(bool){
		PersonalInfo memory info = PersonalInfo(picUrl, name, phone, email,
 																						dateOfBirth, url, position,
																						location);
		mResumeModels[msg.sender].personalInfo = info;
		mResumeModels[msg.sender].isNotEmpty = true;
		return true;
	}

	event experienceEvent(bytes32 startDate,
												bytes32 endDate,
												bytes32 companyName,
												bytes32 position,
												string expText,
 												uint index);

	function triggerGetExperienceByEvent(address accountId) public  {
		if(mResumeModels[accountId].isNotEmpty){
				Experience[] memory expList;
				expList = mResumeModels[accountId].experiences;

				for(uint i=0; i < expList.length; i++){
					Experience memory exp = expList[i];
					emit experienceEvent(	exp.startDate,
																exp.endDate,
																exp.companyName,
																exp.position,
																exp.expText,
																i );
				}
			}
	}

	function addExperience(
													bytes32 startDate,
													bytes32 endDate,
													bytes32 companyName,
													bytes32 position,
 													string expText ) public returns(bool){
		Experience memory exp = Experience(	startDate, endDate, companyName,
 																				position, expText, true);
		mResumeModels[msg.sender].experiences.push(exp);
		return true;
	}

	function updateExperience(
															bytes32 startDate,
															bytes32 endDate,
															bytes32 companyName,
															bytes32 position,
			 												uint index,
 															string expText ) public returns(bool){
		if(mResumeModels[msg.sender].experiences.length > index){
			Experience memory exp = Experience(	startDate, endDate, companyName,
 																					position, expText, true);
			mResumeModels[msg.sender].experiences[index] = exp;
			return true;
		}
		return false;
	}

	event educationEvent(	bytes32 institute,
												bytes32 degree,
												bytes32 faculty,
												bytes32 major,
												bytes32 gpa,
 												uint index);

	function triggerGetEducationByEvent(address accountId) public  {
		if(mResumeModels[accountId].isNotEmpty){
			Education[] memory eduList;
			eduList = mResumeModels[accountId].educations;

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

	function addEducation(
													bytes32 institute,
													bytes32 degree,
													bytes32 faculty,
													bytes32 major,
													bytes32 gpa ) public returns(bool){
		Education memory edu = Education(	institute, degree, faculty,
 																			major, gpa, true);
		mResumeModels[msg.sender].educations.push(edu);
		return true;
	}

	function updateEducation(
														bytes32 institute,
														bytes32 degree,
														bytes32 faculty,
														bytes32 major,
														bytes32 gpa,
		 												uint index ) public returns(bool){
		if(mResumeModels[msg.sender].educations.length > index){
			Education memory edu = Education(	institute, degree, faculty,
 																				major, gpa, true);
			mResumeModels[msg.sender].educations[index] = edu;
			return true;
		}
		return false;
	}

	event skillEvent(	bytes32 skill,
										bytes32 level,
										uint index );

	function triggerGetSkillByEvent(address accountId) public  {
		if(mResumeModels[accountId].isNotEmpty){
			Skill[] memory skillList;
			skillList = mResumeModels[accountId].skills;

			for(uint i=0; i < skillList.length; i++){
				Skill memory skill = skillList[i];
				emit skillEvent(skill._skill, skill.level, i);
			}
		}
	}

	function addSkill(
											bytes32 skill,
											bytes32 level ) public returns(bool){
		Skill memory skillStruct;
		if(	level == SKILL_LEVEL_ADVANCED ||
				level == SKILL_LEVEL_MEDIUM ||
				level == SKILL_LEVEL_BASIC ||
				level == SKILL_LEVEL_ADVANCED ){
			skillStruct = Skill(skill, level, true);
		}else{
			skillStruct = Skill(skill, "", true);
		}
		mResumeModels[msg.sender].skills.push(skillStruct);
		return true;
	}

	function updateSkill(
												bytes32 skill,
												bytes32 level,
												uint index  ) public returns(bool){
		if(mResumeModels[msg.sender].skills.length > index){
			Skill memory skillStruct;
			if(	level == SKILL_LEVEL_ADVANCED ||
					level == SKILL_LEVEL_MEDIUM ||
					level == SKILL_LEVEL_BASIC ||
					level == SKILL_LEVEL_ADVANCED ){
				skillStruct = Skill(skill, level, true);
			}else{
				skillStruct = Skill(skill, "", true);
			}

			mResumeModels[msg.sender].skills[index] = skillStruct;
			return true;
		}
		return false;
	}

}
