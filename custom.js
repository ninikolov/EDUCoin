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


	table = document.getElementById("record_table");

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
    
    // TODO: readEntry
	// --> var contractInstance = web3.eth.contract(contractAbi).at(record_address);
    // // create instance of contract object that we use to interface the smart contract
    // contractInstance.getGreeting(function(error, greeting) {
    //     if (error) {
    //         var errorMsg = 'error reading greeting from smart contract: ' + error;
    //         $('#content').text(errorMsg);
    //         console.log(errorMsg);
    //         return;
    //     }
    //     $('#content').text('greeting from contract: ' + greeting);
    // });

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
				$("#record_table tr").remove();
							
				//////////////
				// TODO: remove these dummy lines
				console.log("Insert row to table");
				var row = table.insertRow(0);
				var cell_subject = row.insertCell(0);
				var cell_institute = row.insertCell(1);
				var cell_grade = row.insertCell(2);
				var cell_ects = row.insertCell(3);
				cell_subject.innerHTML = "DUMMY";
				cell_institute.innerHTML = "DUMMY";
				cell_grade.innerHTML = "DUMMY";
				cell_ects.innerHTML = "DUMMY";
				console.log("ROWS INSERTED");
				//////////////

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
							// var table = document.getElementById("record_table");
							var row = table.insertRow(0);
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
    
    $('#my-form').on('submit', function(e) {
    	console.log("SUBMITTING FORM");
        e.preventDefault(); // cancel the actual submit
        var record_address = $('#n_cc').val(); 
		updateRecord(record_address);
    });


});
