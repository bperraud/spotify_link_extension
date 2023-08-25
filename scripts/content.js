
document.addEventListener("DOMContentLoaded", async function() {
	const accessToken = await getAccessToken();
	if (!accessToken) {
		console.error("Error getting access token");
		return;
	}
	chrome.storage.local.set({ 'accessToken': accessToken });
  });


const client_id = 'fbeef595f76d41a28cab1dc40971e99b';
const client_secret = 'a38593841a674b76bcc7734e26a87df9';

// Obtain access token using the Client Credentials Flow
const getAccessToken = async () => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
	console.log(data);
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

window.addEventListener("message", function (e) {
		console.log("message received");
		//replaceSpotifyLinks();
	});

function isSpotifyLink(url) {
	// Implement a check to verify if the URL is a Spotify link.
	// For example, you can check if the URL contains "spotify.com" or other patterns specific to Spotify links.
	return url.includes("spotify.com");
  }

async function replaceSpotifyLinks() {
	const linkElements = document.querySelectorAll('a[role="link"]');
	for (const element of linkElements) {
		var hrefValue = element.getAttribute('href');
		if (hrefValue.startsWith("/messages/"))
			continue;
		const linkURL = element.textContent;
		if (isSpotifyLink(linkURL)) {
			console.log("Spotify link found: " + linkURL);
			const data = await extractDataLink(linkURL);
			if (data) {
				const artist = data.artists[0].name;
				const songName = data.name;
				const imageUrl = data.album.images[0].url;
				element.textContent = artist + " - " + songName;
				addImage(imageUrl, element)
			}
		}
	}
}


function addImage(imageUrl, targetElement) {
	var imgElement = document.createElement('img');
    // Set the source (URL) of the image
    imgElement.src = imageUrl; // Replace with the actual image URL
    // Append the <img> element to the <span> element
	imgElement.style.width = targetElement.offsetWidth + 'px';
    targetElement.appendChild(imgElement);
}

async function extractDataLink(spotifyTrackUrl) {
	const replacedString = spotifyTrackUrl.replace(/%/g, '/');
	const trackId = replacedString.split("/").pop();

	const accessToken = await new Promise((resolve) => {
		chrome.storage.local.get('accessToken', function(result) {
		  const token = result.accessToken;
		  resolve(token);
		});
	  });

	// Now you have the accessToken
	try {
		const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

		if (response.ok) {
			const data = await response.json();
			// Extract the artist and song names from the response
			return data;
		} else {
			throw new Error("Error fetching track information");
		}
	}
	catch (error) {
		console.error("Error getting track information:", error);
		return null;
	}
}

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "runScript") {
	  // Your code to manipulate the DOM of the active tab
	  // For example, you can use document.querySelector and other DOM methods here
	  replaceSpotifyLinks();
	  sendResponse({ message: "Content script executed" });
	}
  });

  // Function to observe DOM changes and detect chat windows
  function onElementChange(mutationsList, observer) {
	for (const mutation of mutationsList) {
	  if (mutation.type === 'childList' || mutation.type === 'attributes') {
		// Check if the specific element has been modified
		if (mutation.target.getAttribute('data-scope') === 'messages_table') {
		  // Trigger your desired function here
		  console.log('Target element has changed:', mutation.target);
		  // Call your function here
		  // yourFunction();
		}
	  }
	}
  }

// Select the target nodes (elements with data-scope="messages_table")
const targetNodes = document.querySelectorAll('[data-scope="messages_table"]');

// Create a new MutationObserver instance for each target node
targetNodes.forEach(targetNode => {
  const observer = new MutationObserver(onElementChange);
  // Start observing the target node with the specified options
  observer.observe(targetNode, observerOptions);
});




