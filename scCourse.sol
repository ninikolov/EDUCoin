pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;
contract EduBase{
  struct CreditCoin
  {
      string subject;
      string institute;
      uint256 grade;
      uint256 ects;
  }
}

/*
	holds an array of all CreditCoins of a student
*/
contract Record is EduBase { // TODO: rename to AcademicRecord

	CreditCoin[] private diploma;

	uint256 public numberOfCC;

	function Record() public{
	    numberOfCC=0;
	}

	// string private name; // probably not needed

	//address private addr;

	/*function Record(address a) {
	    addr = a;
	}

	function getAddress() view public  returns (address a) {
	    a = addr;
	}*/

	/*
	function getName() view public returns(string studentName) {
	    studentName = name;
	}
	*/

	function addCreditCoin(CreditCoin cc) public {
		diploma.push(cc);
	    numberOfCC++;
	}
	//TODO
	function readEntryCC(uint256 index) view public returns(CreditCoin) {
	    return diploma[index];
	}

	// TODO: good idea to return credit coin??
	// consider returning only grades for example
	// TODO: consider renaming CreditCoin (remove coin from the name)
	function getCreditCoins() view public returns(CreditCoin[]) {
	    return diploma;
	}

}

/*
	holds mapping from each student to academic record
*/
contract WorldEducation is EduBase {

	// map from student address to academic record of student
	mapping (address => address) private student_record;

	function addCreditCoin(address student, CreditCoin cc) public {
	    Record(student_record[student]).addCreditCoin(cc);
	}

	function getDiploma(address student) view public returns(CreditCoin[]) {
	    Record(student_record[student]).getCreditCoins();
	}

	function addStudentRecord(address student, address record) public {
	    student_record[student] = record;
	}

}

contract PriorityCoin{
    mapping(address => uint256) private spentOf;
    address public owner = msg.sender;
    uint256 constant initialBalance = 100;

    function consumeAmount(address to, uint256 amount) public{
        require(initialBalance - spentOf[msg.sender] >= amount);
        spentOf[msg.sender] += amount;
        // TODO implement that the course receives amount of spent bids
    }
}

contract Course is EduBase{

    PriorityCoin pc;
    WorldEducation we;
    address public owner;
    string public subject;
    string public institute;
    uint256 public ects;
    uint256 public maxNumberOfStudents;
    uint256 public curNumberOfStudents;
    mapping(address => uint256) private studentBids;
    mapping(uint256 => address) public studentList;


    function Course(string _subject, address _pc, address _we, uint256 _maxNumberOfStudents) public{
        owner = msg.sender;
        subject = _subject;
        pc = PriorityCoin(_pc);
        we = WorldEducation(_we);
        maxNumberOfStudents = _maxNumberOfStudents;
        curNumberOfStudents = 0;
    }

    function bidForCourse(uint256 bid, address record) public{
        // Only increase the student number counter if it is the first bid
        // Condition for a new student is that the field is initialized to 0
        require(bid > 0);
        we.addStudentRecord(msg.sender, record);
        if(studentBids[msg.sender] == 0){
            studentList[curNumberOfStudents] = msg.sender;
            curNumberOfStudents++;
        }
        pc.consumeAmount(owner,bid);
        studentBids[msg.sender]=bid;
    }

    function performAuction() public {
        // TODO Actuall need to find the maxNumberOfStudents highest
        // Instead currently: First-come-first-serve
        for(uint256 i = maxNumberOfStudents; i < curNumberOfStudents; ++i){
            delete(studentList[i]);
        }
        if(maxNumberOfStudents < curNumberOfStudents){
            curNumberOfStudents = maxNumberOfStudents;
        }
    }

    function getTotalNumberOfStudents() public view returns(uint256){
        return curNumberOfStudents;
    }

    function getStudentAddress(uint256 _num) public view returns (address) {
        return studentList[_num];
    }

    function grade(address _address,uint256 mark) public {
        CreditCoin memory creditCoin = CreditCoin(subject, institute, mark, ects);
        we.addCreditCoin(_address,creditCoin);
    }

    /*function distributeCredits() public{
    }

    function feedback(uint256 score) public{
    }

    function getAverageFeedback() public returns (uint256) {
        return 0;
    }*/
}
