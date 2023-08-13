// Afficher une alerte pour tester si le contenu du script est injecté correctement sur les pages web.
//alert("Extension Chrome fonctionne !");


document.addEventListener("DOMContentLoaded", function() {
	replaceSpotifyLinks();
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

// Make API request to retrieve track information
const getTrackInfo = async (trackId, accessToken) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting track information:', error);
    return null;
  }
};

//chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//	if (message.action === "performAction") {
//	  // Your function to perform when the message with action "performAction" is received
//	  replaceSpotifyLinks();
//	}
//});

window.
	addEventListener("message", function (e) {
		console.log("message received");
		replaceSpotifyLinks();
	});

function isSpotifyLink(url) {
	// Implement a check to verify if the URL is a Spotify link.
	// For example, you can check if the URL contains "spotify.com" or other patterns specific to Spotify links.
	return url.includes("spotify.com");
  }


async function replaceSpotifyLinks() {
	const linkElements = document.querySelectorAll('a[role="link"]');

	for (const element of linkElements) {
	  const linkURL = element.href;
	  if (isSpotifyLink(linkURL)) {
		console.log("Spotify link found: " + linkURL);
		const artistName = await extractArtistName(linkURL);
		if (artistName) {
		  element.textContent = artistName;
		}
	  }
	}
}

  async function extractArtistName(spotifyTrackUrl) {
	const trackId = spotifyTrackUrl.split("/").pop();

	console.log("trackId: " + trackId);

	const accessToken = await getAccessToken();
	if (!accessToken) {
		console.error("Error getting access token");
		return;
	}

	try {
		const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		});

		if (response.ok) {
			const data = await response.json();
			// Extract the artist and song names from the response
			const artist = data.artists[0].name;
			const songName = data.name;

			// Output the results
			console.log("Artist:", artist);
			console.log("Song Name:", songName);

			return artist + " - " + songName;
		} else {
			throw new Error("Error fetching track information");
		}
	}
	catch (error) {
		console.error("Error getting track information:", error);
		return null;
	}
}


  // Call the replaceSpotifyLinks function when the page is loaded.
  window.addEventListener("load", replaceSpotifyLinks);


  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "runScript") {
	  // Your code to manipulate the DOM of the active tab
	  // For example, you can use document.querySelector and other DOM methods here
	  console.log("content.js");
	  replaceSpotifyLinks();
	  sendResponse({ message: "Content script executed" });
	}
  });
