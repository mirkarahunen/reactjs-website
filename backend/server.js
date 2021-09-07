const filesystem = require('fs')
const path = require('path')
const cors = require('cors');

let querystring = require('querystring')
let request = require('request')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Import routes
const usersRoutes = require('./routes/users-routes')
const playlistsRoutes = require('./routes/playlists-routes')
const commentRoutes = require('./routes/comments-routes')
const messageRoutes = require('./routes/messages_routes')

const app = express()

const dotenv = require('dotenv').config();

 /*--------------------------------------------------------------------------*/
// Connecting to Spotify API

const SPOTIFY_CLIENT_ID = '9670d1447e4745678649223b549058c7' //process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = '3e3896c27f734c6182a2a64c9930194a' //process.env.SPOTIFY_CLIENT_SECRET

let redirect_uri = 'http://localhost:3000/create-playlists'
  //process.env.REDIRECT_URI

  // Direct user to Spotify login to authenticate
app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: '9670d1447e4745678649223b549058c7', //process.env.SPOTIFY_CLIENT_ID
      // Give the app the permission to change these information on the Spotify profile
      scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-collaborative playlist-read-private',
      redirect_uri
    }))
})

// Callback afer authentication, create user access token
app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(
        '9670d1447e4745678649223b549058c7'  + ':' + '3e3896c27f734c6182a2a64c9930194a'
        //process.env.SPOTIFY_CLIENT_ID               //process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }

  // Redirect user back to beats app with access token in the url
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = 'http://localhost:3000'//process.env.FRONTEND_URI 
    res.redirect(uri + '?access_token=' + access_token)
  })
})
/* -------------------------------------------------------------- */
// Use middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

  next();
})

/* -------------------------------------------------------------- */
// Use created routes
app.use('/users', usersRoutes)
app.use('/playlists', playlistsRoutes)
app.use('/comments', commentRoutes)
app.use('/messages', messageRoutes)


app.use((req, res, next) => {
  const error = new Error('Could not find this route.')
  throw error;
})

app.use((error, req, res, next) => {
  if (req.file) {
    // Unlink and remove uploaded image if validation not successful
    filesystem.unlink(req.file.path, err => {
      console.log(err);
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' })
})


/* -------------------------------------------------------------- */
// Connect to the database
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose
  .connect(
    
    `mongodb+srv://testUser:sK2THyiXAAHhISAM@beatscluster.b1em3.mongodb.net/beats_db?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    
  )
  .then(() => {
    app.listen(5000);
    console.log(`listening on port 5000`)
  })
  .catch(err => {
    console.log(err);
  })
