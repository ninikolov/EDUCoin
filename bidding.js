$(window).on('load', function() {
    
    var contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"components": [
					{
						"name": "subject",
						"type": "string"
					},
					{
						"name": "institute",
						"type": "string"
					},
					{
						"name": "grade",
						"type": "uint256"
					},
					{
						"name": "ects",
						"type": "uint256"
					}
				],
				"name": "cc",
				"type": "tuple"
			}
		],
		"name": "addCreditCoin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "returnTotalNumberOfCC",
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
		"name": "getCreditCoins",
		"outputs": [
			{
				"components": [
					{
						"name": "subject",
						"type": "string"
					},
					{
						"name": "institute",
						"type": "string"
					},
					{
						"name": "grade",
						"type": "uint256"
					},
					{
						"name": "ects",
						"type": "uint256"
					}
				],
				"name": "",
				"type": "tuple[]"
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
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "readEntry",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
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
		"name": "numberOfCC",
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
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
];

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        $('#content').text('I have web3!!!');
        window.web3 = new Web3(web3.currentProvider);
    } else {
        var errorMsg = 'I don\'t have web3 :( Please open in Google Chrome Browser and install the Metamask extension.';
        $('#content').text(errorMsg);
        console.log(errorMsg);
        return;
    }
    
 	function doBidding(bid, course_address) {
		// create instance of contract object that we use to interface the smart contract
		var contractInstance = web3.eth.contract(contractAbi).at(course_address);
		contractInstance.bidForCourse(bid, course_address, 
			function(error) {
				if (error) {
					var errorMsg = 'Bidding: An error occurred' + error;
					$('#content').text(errorMsg);
					console.log(errorMsg);
					return;
				}
			$('#content').text('Bid submitted ' + bid + ' for course ' + course_address);
		});
	}
    
    $('#my-form').on('submit', function(e) {
        e.preventDefault(); // cancel the actual submit
		for (i = 1; i <= 2; i++)
		{
			var bid = $('#c_prio_' + i).val();
			var record_address = $('c_add_' + i).val();
			doBidding(bid, record_address);
		}
    });
});
