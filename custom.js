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


	tablebody = document.getElementById("record_table").tBodies[0];

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

	function updateRecord(record_address) {

		// create instance of contract object that we use to interface the smart contract
		var contractInstance = web3.eth.contract(contractAbi).at(record_address);

		// asynchronously call a function on the blockchain
		contractInstance.returnTotalNumberOfCC(
			function(error, n_cc) {
				console.log("returnTotalNumberOfCC callback");
				if (error) {
					var errorMsg = 'Update record: an error occurred' + error;
					$('#content').text(errorMsg);
					console.log(errorMsg);
					return;
				}
				$('#content').text('N = ' + n_cc);

				// clear table
				$("#record_table tbody tr").remove();
							
				for(i=0; i<n_cc; ++i) {
					contractInstance.readEntry(
						i,
						function(error, cc_entries) {
							console.log("readEntry callback");
							if (error) {
								var errorMsg = 'Update record: an error occurred' + error;
								$('#content').text(errorMsg);
								console.log(errorMsg);
								return;
							}

							// append entry to table
							var row = tablebody.insertRow(-1);
							var cell_subject = row.insertCell(0);
							cell_subject.innerHTML = cc_entries[0];
							var cell_institute = row.insertCell(1);
							cell_institute.innerHTML = cc_entries[1];
							var cell_grade = row.insertCell(2);
							cell_grade.innerHTML = cc_entries[2];
							var cell_ects = row.insertCell(3);
							cell_ects.innerHTML = cc_entries[3];
						}

					);
				}
			}
		);

	}
    
    $('#record_form').on('submit', function(e) {
    	console.log("SUBMITTING FORM");
        e.preventDefault(); // cancel the actual submit
        var record_address = $('#academic_record_input').val(); 
		updateRecord(record_address);
    });


});
