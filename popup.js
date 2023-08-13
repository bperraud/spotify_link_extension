// Description: This script is run when the popup is opened. It adds a click event listener to the button and sends a message to the content script when the button is clicked.

document.addEventListener("DOMContentLoaded", function() {
	// Add a click event listener to the button
	const myButton = document.getElementById("myButton");
	myButton.addEventListener("click", function() {


		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const activeTab = tabs[0];
			chrome.tabs.sendMessage(activeTab.id, { action: "runScript" }, function (response) {
			  // Handle the response from the content script if needed
			});
		  });

	});

});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("chrome.runtime.onMessage.addListener");
    if (request.action === "downloadImage") {
        chrome.downloads.download({ url: request.imageUrl }, function(downloadId) {
            sendResponse({ downloadId: downloadId });
        });
        return true;
    }
});

//$("#myButton").click(function() {
//    // Code to execute when the button is clicked
//    console.log("Button clicked!");
//});


  window.onload = function (e) {
	console.log("window.onload");
	  };
