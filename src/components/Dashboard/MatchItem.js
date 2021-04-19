import React, { useState } from 'react';
import '../Lists/ListsItems.css'

const MatchItem = props => {
  const [ send, setSend ] = useState(false)

  // Show link to send a message to the user
  const hoverEffectShow = () => {
    setSend(true)  
  }
// Hide link to send a message to the user
  const hoverEffectHide = () => {
    setSend(false)  
  }

if (props.matches.length === 0) {
  return(
    <div className="match">
      <h3>No Matches</h3>
    </div>
  )} else {
        return(
          <div className="Lists-cards">
            {/* --- Show only the latest 10 matches --- */}
            {props.matches.slice(Math.max(props.matches.length - 10, 0)).map((item, i) => {
              return(
      
             <div className="Card"
                  onMouseOver={hoverEffectShow} 
                  onMouseLeave={hoverEffectHide} 
                  key={i} 
                  onClick={() => {
                    localStorage.setItem("matchUserID", JSON.stringify({ userID: item.userID }))
                    window.location = `/messages/${item.id}/${item.name}`
                  }}
                >
                <div className="Card-body">                
                {!send ?
                <>
                  <h4>Match with</h4>
                  <p key={item.i}>{item.name}</p>
                </>  
                  :
                  <p>Send a message to {item.name}</p>
                 }
                </div>
              </div> 
            )})}
          </div>    
        )
      }
}

export default MatchItem