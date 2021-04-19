import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import CommentItem from './ShowComments/CommentItem'
import PlaylistItem from './ShowPlaylist/PlaylistItem'
import './Comments.css'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useHttpClient } from '../shared/http-hook'
import AuthContext from '../shared/auth-context'
import { useForm } from '../shared/form-hook'
import Input from '../shared/Input/Input'
import { VALIDATOR_REQUIRE } from '../../util/Validators/Validators'


const Comments = () => {
    const [loadedContent, setLoadedContent] = useState()
    const [loadedPlaylists, setLoadedPlaylists] = useState([])
    const [newComment, setNewComment] = useState('')
    const { isLoading, sendRequest } = useHttpClient()
    const playlistId = useParams().id
    const auth = useContext(AuthContext)
    const userId = auth.userId
    const username = JSON.parse(localStorage.userData).username
    const user_image = JSON.parse(localStorage.userData).image


    useEffect(() => {
      // Fetch playlists from the db
      const fetchPlaylists = async () => {
        try {
          const response = await sendRequest('http://localhost:5000/playlists')
          //console.log(response)
          setLoadedPlaylists(response.playlists)
          
        } catch (error) {}
      }
      fetchPlaylists()


      // Fetch comments with the playlist id from db
      const fetchComments = async () => {
        try {
            const responseData = await sendRequest(`http://localhost:5000/comments/${playlistId}`)
            setLoadedContent(responseData.comment) 
            
        } catch (error) {}
      }
      fetchComments()  
    
    }, [sendRequest, playlistId, userId, newComment])
/* ----------------------- END OF USE EFFECT AND FETCHING DATA FROM DB -----------------------*/ 


    /* ----- POST NEW COMMENTS -----*/ 

    // SETTING FORM STATE TO EMPTY BEFORE FORM ENTRY AND VALIDATION
    const [formState, inputHandler] = useForm(
      {
        content: {
          value: '',
          isValid: false
        }
      },
      false
    );

// Post new comments to the playlist and db
const submitHandler = async event => {
    event.preventDefault();

    try {
       await sendRequest('http://localhost:5000/comments', 
        'POST',
        JSON.stringify({
            content: formState.inputs.comment.value,
            writerId: userId,
            writer: username,
            writerImage: user_image,
            playlist: playlistId
        }),
        {
            'Content-Type': 'application/json'
        }
        );

        setNewComment(formState.inputs.comment.value)
        
    } catch (err) {}
}


    return (
        <div className="playlist-comments-section">
          {isLoading && (<LoadingSpinner asOverlay/>)}
          {!isLoading && loadedContent && (
            <>
            {/* ---- Pass props to other components ---- */}
          <PlaylistItem item={loadedContent} playlists={loadedPlaylists}/>
          <CommentItem items={loadedContent} />

          {/* ---- POST COMMENTS SECTION ---- */}
          <div className="comments-section">
            <form method="POST" className="comments-form">
            <div className="input-button-section">    
            <Input 
                className="comment-class"
                element="input"
                id="comment" 
                type="text" 
                placeholder="Write your comment here" 
                onInput={inputHandler} 
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Minimum of 2 characters are required to post a comment" 
                 />
                
            <button type="submit" onClick={submitHandler} className="comment-btn">Submit comment</button>
            </div>
            </form>
        </div>
          </>
          )}   
        </div>
      )
}

export default Comments