// Defining interfaces to Solidity

$(window).on('load', function() {
    
    var contractAbi = [
	{
		"constant": true,
		"inputs": [],
		"name": "subject",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "curNumberOfStudents",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "maxNumberOfStudents",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "institute",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "studentList",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ects",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTotalNumberOfStudents",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_num",
				"type": "uint256"
			}
		],
		"name": "getStudentAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			},
			{
				"name": "mark",
				"type": "uint256"
			}
		],
		"name": "grade",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "bid",
				"type": "uint256"
			},
			{
				"name": "record",
				"type": "address"
			}
		],
		"name": "bidForCourse",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "performAuction",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_subject",
				"type": "string"
			},
			{
				"name": "_pc",
				"type": "address"
			},
			{
				"name": "_we",
				"type": "address"
			},
			{
				"name": "_maxNumberOfStudents",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log('I have web3!!!');
        window.web3 = new Web3(web3.currentProvider);
    } else {
        var errorMsg = 'I don\'t have web3 :( Please open in Google Chrome Browser and install the Metamask extension.';
        $('#content').text(errorMsg);
        console.log(errorMsg);
        return;
    }
    

    // Perform course auction - determine which students will be able to take the course (course address given in the HTML form)
    $('#grading_form1').on('submit', function(e) {
        e.preventDefault(); // cancel the actual submit
		var course_address = $('#c_add').val();
		var contractInstance = web3.eth.contract(contractAbi).at(course_address);
		contractInstance.performAuction( 
			function(error) {
				if (error) {
					var errorMsg = 'Auction: An error occurred' + error;
					$('#content').text(errorMsg);
					console.log(errorMsg);
					return;
				}
			console.log('Auction performed for course ' + course_address);
		});
    });

    // Grade Student - assigns a grade to the given student (both values read from HTML form)
    $('#grading_form2').on('submit', function(e) {
        e.preventDefault(); // cancel the actual submit
		var course_address = $('#c_add').val();
		var student_address = $('#s_addr').val();
		var mark = $('#grade').val();
		var contractInstance = web3.eth.contract(contractAbi).at(course_address);
		contractInstance.grade(student_address, mark, 
			function(error) {
				if (error) {
					var errorMsg = 'Grading: An error occurred' + error;
					$('#content').text(errorMsg);
					console.log(errorMsg);
					return;
				}
			console.log('Grading performed for course ' + course_address);
		});
    });
});
