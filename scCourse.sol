pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

// Shared data structure representing course attributes (for convenience)
contract EduBase{
  struct CreditCoin
  {
      string subject;
      string institute;
      uint256 grade;
      uint256 ects;
  }
}

// Record - holds an array of all CreditCoins of a student, equivalent of a digital CV on the blockchain
contract Record is EduBase {

	CreditCoin[] private diploma;

	uint256 public numberOfCC;
	address private owner;

	// Constructor
	function Record() public{
	    owner=msg.sender;
	    numberOfCC=0;
	}

	// return number of completed courses, i.e. number of CC
	function returnTotalNumberOfCC() view public returns(uint256){
	    return numberOfCC;
	}

	// add a CC to the academic record
	//  _add - address of student who completed the course, make sure this corresponds to CV owner
	function addCreditCoin(CreditCoin cc, address _add) public {
	    require(owner == _add);
		diploma.push(cc);
	    numberOfCC++;
	}

	// read a given entry of the digital CV / academic record from the blockchain
	//  index - index of the course on the academic record
	// return course information about requested course
	function readEntry(uint256 index) view public returns(string, string, uint256, uint256) {
	    return (diploma[index].subject,diploma[index].institute,diploma[index].grade,diploma[index].ects);
	}

	// return the list of completed courses, i.e. the wallet containing all CC
	function getCreditCoins() view public returns(CreditCoin[]) {
	    return diploma;
	}

}


// WorldEducation - holds mapping from each student to academic record
contract WorldEducation is EduBase {

	// map from student address to academic record of student
	mapping (address => address) private student_record;

	// add a credit coint to the academic record of a given student
	//  student - student address
	//  cc - credit coin to add
	function addCreditCoin(address student, CreditCoin cc) public {
	    Record(student_record[student]).addCreditCoin(cc,student);
	}

	// request diploma of a given student
	//  student - address of student
	// returns a list of credit coins, i.e. the full academic record of the student
	function getDiploma(address student) view public returns(CreditCoin[]) {
	    Record(student_record[student]).getCreditCoins();
	}

	// register a new student in the ledger
	//  student - address of student
	//  record - address of the smart contract academic record associated with the student
	function addStudentRecord(address student, address record) public {
	    student_record[student] = record;
	}

}


// PriorityCoin - digital currency used for bidding for courses
contract PriorityCoin{
    mapping(address => uint256) private spentOf;
    address public owner = msg.sender;
    uint256 constant initialBalance = 100;

	// transfer amount of PCs to a different party (usually course owner)
	//  to - address of recipient of PCs
	//  amount - amount of PCs to transfer
    function consumeAmount(address to, uint256 amount) public{
        require(initialBalance - spentOf[msg.sender] >= amount);
        spentOf[msg.sender] += amount;
    }
}


// Course - smart contract representing a course unit
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


	// constructor
    function Course(string _subject, address _pc, address _we, uint256 _maxNumberOfStudents) public{
        owner = msg.sender;
        subject = _subject;
        institute = "ETH";
        ects = 3;
        pc = PriorityCoin(_pc);
        we = WorldEducation(_we);
        maxNumberOfStudents = _maxNumberOfStudents;
        curNumberOfStudents = 0;
    }

	// bid for the course
	//  bid - amount of PCs to bid
	//  record - address of the smart contract of the academic record, for which the course should be registered upon completion
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

	// select students from pool of applicants
    function performAuction() public {
        // Currently: First-come-first-serve
        // Future: should be accepting highest bidders
        for(uint256 i = maxNumberOfStudents; i < curNumberOfStudents; ++i){
            delete(studentList[i]);
        }
        if(maxNumberOfStudents < curNumberOfStudents){
            curNumberOfStudents = maxNumberOfStudents;
        }
    }

	// return number of students in the course
    function getTotalNumberOfStudents() public view returns(uint256){
        return curNumberOfStudents;
    }

	// get the address of a student based on his list-id
	//  _num - index of student in list
	// return the address of a given student
    function getStudentAddress(uint256 _num) public view returns (address) {
        return studentList[_num];
    }

	// assign grade to student
	//  _address - address of student that should be graded
	//  mark - grade/score of the student
    function grade(address _address,uint256 mark) public {
        CreditCoin memory creditCoin = CreditCoin(subject, institute, mark, ects);
        we.addCreditCoin(_address,creditCoin);
    }

}
