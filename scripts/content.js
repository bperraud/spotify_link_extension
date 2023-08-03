// Afficher une alerte pour tester si le contenu du script est injecté correctement sur les pages web.
//alert("Extension Chrome fonctionne !");

// Modifier le contenu de la page pour tester l'injection de code.
document.fonts = "ui-rounded";


document.addEventListener("DOMContentLoaded", function() {
	replaceSpotifyLinks();
  });


//chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//	if (message.action === "performAction") {
//	  // Your function to perform when the message with action "performAction" is received
//	  replaceSpotifyLinks();
//	}
//});

function replaceSpotifyLinks() {
	// Query all elements with role="link" in the document.
	const linkElements = document.querySelectorAll('a[role="link"]');

	const divElements = document.querySelectorAll('div');

	// Loop through each div element and change the background color
	//divElements.forEach((div) => {
	//  console.log(div);
	//  div.style.backgroundColor = 'blue'; // Replace 'yellow' with your desired background color
	//});

	console.log("function replace");

	linkElements.forEach((element) => {
	//  console.log(element);
	  const linkURL = element.href;
	  if (isSpotifyLink(linkURL)) {
		console.log("Spotify link found: " + linkURL);
		const artistName = extractArtistName(linkURL);
		if (artistName) {
		  element.textContent = artistName;
		}
	  }
	});
  }

  function isSpotifyLink(url) {
	// Implement a check to verify if the URL is a Spotify link.
	// For example, you can check if the URL contains "spotify.com" or other patterns specific to Spotify links.
	return url.includes("spotify.com");
  }

  function extractArtistName(spotifyTrackUrl) {
	const trackId = spotifyTrackUrl.split("/").pop();

	// Make a GET request to the Spotify API
	fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
	headers: {
		Authorization: `Bearer ${accessToken}`,
	},
	})
	.then((response) => response.json())
	.then((data) => {
		// Extract the artist and song names from the response
		const artist = data.artists[0].name;
		const songName = data.name;

		// Output the results
		console.log("Artist:", artist);
		console.log("Song Name:", songName);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
  }

  // Call the replaceSpotifyLinks function when the page is loaded.
  window.addEventListener("load", replaceSpotifyLinks);


  setInterval(replaceSpotifyLinks, 10000); // 5000 milliseconds = 5 seconds
