import queryString from 'query-string';

// Search songs, bands etc from spotify
const SpotifySearch = {
  search(searchWord) {
    // parse window location and access token
     let parsed = queryString.parse(window.location.search);
     let accessToken = parsed.access_token;

     // Fetch information from spotify with written search word
     return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchWord}`, {
       headers: {
         Authorization: 'Bearer ' + accessToken
       }
     }).then(response => {
       return response.json();
     }).then(data => {
       // If no tracks found, return empty array
       if (!data.tracks) {
         return [];
       }
       // else return an array of songs with their details
       return data.tracks.items.map(track => ({
         id: track.id,
         name: track.name,
         artist: track.artists[0].name,
         album: track.album.name,
         uri: track.uri
       }));
     });
  }
}

export default SpotifySearch;
