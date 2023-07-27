// Description: This script is run when the popup is opened. It adds a click event listener to the button and sends a message to the content script when the button is clicked.

console.log("open popup.js");

document.addEventListener("DOMContentLoaded", function() {
	// Add a click event listener to the button
	const myButton = document.getElementById("myButton");
	myButton.addEventListener("click", function() {
	  // Send a message to the content script
	//  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	//	chrome.tabs.sendMessage(tabs[0].id, { action: "performAction" });
	//  });
		console.log("popup.js");
	});
  });
