import React from 'react';
import '../Lists/ListsItems.css'
import SingleListItem from './SingleListItem'

const ListsItem = props => {
//console.log(props);
    if (props.playlists.length === 0) {
        return(
          <div className="Lists">
            <h3>No playlists</h3>
          </div>
        )
    } else {
        return(
          <div className="Lists-cards">    
          {/* ---- Show only the latest 5 playlists ---- */}
            {props.playlists.slice(Math.max(props.playlists.length - 5, 0)).map((item, i) => {
            return(
            <SingleListItem 
              key={i}
              id={item.id}
              name={item.name}
              creator={item.creator}
            />
          )})}
                  
          </div>
            
        )
    }
}

export default ListsItem