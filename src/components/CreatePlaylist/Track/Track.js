import React from 'react';
import './Track.css';


class Track extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
// Render adding songs to a playlist and removing them 
  renderAction() {
    if(this.props.isRemoval) {
      return <button className="Track-action" onClick={this.removeTrack}>-</button>
    } else {
      return <button className="Track-action" onClick={this.addTrack}>+</button>
    }
  }
// Handle adding songs
  addTrack() {
    this.props.onAdd(this.props.track);
  }
// Handle removing songs
  removeTrack() {
    this.props.onRemove(this.props.track);
  }


  render() {
    return(
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction()}
      </div>
    )
  }
}

export default Track;
