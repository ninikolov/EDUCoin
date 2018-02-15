pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;

/*
	credit coin describes 
*/
contract EduBase {
	struct CreditCoin {
		string subject;
		string educator;
		uint grade;
		uint ects;
	}
}

/*
	holds an array of all CreditCoins of a student
*/
contract Record is EduBase { // TODO: rename to AcademicRecord

	CreditCoin[] private diploma;
	
	// string private name; // probably not needed
	
	address private addr;
	
	function Record(address a) {
	    addr = a;
	}
	
	function getAddress() view public  returns (address a) {
	    a = addr;
	}
	
	/*
	function getName() view public returns(string studentName) {
	    studentName = name;
	}
	*/

	function addCreditCoin(CreditCoin cc) public {
		diploma.push(cc);
	}
	
	// TODO: good idea to return credit coin??
	// consider returning only grades for example
	// TODO: consider renaming CreditCoin (remove coin from the name)
	function getCreditCoins() view public returns(CreditCoin[] cc) {
	    return diploma;
	}

}

/*
	holds mapping from each student to academic record
*/
contract WorldEducation is EduBase {

	// map from student address to academic record of student
	mapping (address => Record) private student_record;
	
	function addCreditCoin(address student, CreditCoin cc) public {
	    student_record[student].addCreditCoin(cc);
	}

	function getDiploma(address student) view public returns(CreditCoin[] cc) {
	    student_record[student].getCreditCoins();
	}
	
	function addStudentRecord(address student, Record record) public {
	    student_record[student] = record;
	}

}
