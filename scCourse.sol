pragma solidity ^0.4.17;

contract PriorityCoin{
    mapping(address => uint256) private balanceOf;

    address public owner = msg.sender;

    /*function buyTokens() payable public{
        owner.transfer(msg.value);
        balanceOf[msg.sender] += msg.value;
    }

    function transfer(address to, uint256 amount) public {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
    }*/

    function consumeAmount(address to, uint256 amount) public{
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
    }
}

contract Course {
    PriorityCoin PC;
    address public owner;
    uint256 public maxNumberOfStudents;
    uint256 public curNumberOfStudents;
    mapping(address => uint256) private studentBids;
    mapping(uint256 => address) public studentList;


    function Course(address _pc, uint256 _maxNum) public{
        owner = msg.sender;
        PC = PriorityCoin(_pc);
        maxNumberOfStudents = _maxNum;
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
        PC.consumeAmount(owner,bid);
        studentBids[msg.sender]=bid;
    }

    function performAuction() public {
        // TODO Need to find the maxNumberOfStudents highest
        for(uint256 i = maxNumberOfStudents; i < curNumberOfStudents; ++i){
            delete(studentList[i]);
        }
        if(maxNumberOfStudents < curNumberOfStudents)
            curNumberOfStudents = maxNumberOfStudents;
    }
}
