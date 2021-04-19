import React from 'react';
import SingleMessageItem from './SingleMessageItem'

// Display users already started chats in the messages section
const MessageItem = props => {
    if (props.items.length === 0) {
        return(
          <div className="Lists">
            <div className="Lists-header">
              <h3>No chats</h3>
            </div>
          </div>
        )
    } else {
        return(
        <div className="Lists">
          <div className="Lists-header">
              <h3>Chats</h3>
            </div>
          <div className="Lists-cards">    
            {props.items.map((item, i) => {

            return(
            <SingleMessageItem
              key={i}
              id={item.id}
              chatID={item.chatID} 
              userInfo={Object.values(item.chat)}
              
              
            />
          )})}
                  
          </div>
        </div>    
        )
    }
}

export default MessageItem