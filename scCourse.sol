pragma solidity ^0.4.17;

contract EduBase{
  struct CreditCoin
  {
      string subject;
      string institute;
      uint256 grade;
      uint256 ects;
  }
}

contract WorldsEducation is EduBase{
    mapping(address => uint256) private studentAchievements;

    function addAchievement(CreditCoin cc) public {

    }
}

contract PriorityCoin{
    mapping(address => uint256) private balanceOf;
    address public owner = msg.sender;
    function consumeAmount(address consumer, uint256 amount) public{
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        balanceOf[consumer] += amount;
    }
}

contract Course is EduBase{

    PriorityCoin pc;
    WorldsEducation we;
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
        we = WorldsEducation(_we);
        maxNumberOfStudents = _maxNumberOfStudents;
        curNumberOfStudents = 0;
    }

    function bidForCourse(uint256 bid) public{
        // Only increase the student number counter if it is the first bid
        // Condition for a new student is that the field is initialized to 0
        require(bid > 0);
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

    function getStudentNumber() public view returns(uint256){
        return curNumberOfStudents;
    }

    function getStudentList() public view {

    }

    function grade(uint256 mark) public {
        CreditCoin memory creditCoin = CreditCoin(subject, institute, mark, ects);
        we.addAchievement(creditCoin);
    }

    /*function distributeCredits() public{
    }

    function feedback(uint256 score) public{
    }

    function getAverageFeedback() public returns (uint256) {
        return 0;
    }*/
}
