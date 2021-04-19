import queryString from 'query-string';

// Save playlist to spotify
const SpotifySave = {
// If playlist does not have a name or no tracks (trackUris) -> return code
  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    // Parse window location and access code
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    let user_id;

    // Fetch information from spotify api
    return fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-type': 'application/json'
      }
    }).then(response => response.json())
    .then(data => {
      // Set spotify user id
      user_id = data.id;

      // post to users playlist in spotify
      return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})

      }).then(response => response.json())
      
      .then(data => {
        // Set playlist id
        const playlistId = data.id;

        // post playlist tracks with playlist id to spotify
        return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
}

export default SpotifySave;
