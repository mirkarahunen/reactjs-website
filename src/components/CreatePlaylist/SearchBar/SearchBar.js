import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    // Initial value for search word
    this.state = {
      searchWord: '',
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
// Handle search word state
  search(searchWord) {
     this.props.onSearch(this.state.searchWord);
  }
// Set new value to search word
  handleTermChange(event) {
    this.setState({searchWord: event.target.value})
  }

  render() {
    return(
        <div className="SearchBar">
          <input className="searchBar-input" placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
          <button className="SearchButton" onClick={this.search}>SEARCH</button>
          
        </div>
      )
    }
  }

export default SearchBar;
