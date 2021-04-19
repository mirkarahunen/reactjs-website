import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {

render() {

  return(
      <div className="SearchResults">
        <h3>Results</h3>
        {/* --- Render search results in a list --- */}
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd}/>
         
      </div>
    )
  }
}

export default SearchResults;
