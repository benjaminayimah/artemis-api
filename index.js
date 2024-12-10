const express = require('express')
const chatRoutes = require('./routes/chatRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const userRoutes = require('./routes/userRoutes');
const webRoute = require('./routes/web')
const authRoutes = require('./routes/authRoutes')
const agentRoutes = require('./routes/agentRoutes')
const favouriteRoutes = require('./routes/favouriteRoutes')


const session = require('express-session');

const WebSocket = require('ws');

require('./config/passportConfig'); // Import your passport configuration

const passport = require('passport')


require('dotenv').config()

const path = require('path');

const helmet = require('helmet');

const rateLimit = require('express-rate-limit');


const cors = require('cors')



const app = express()

// const wss = new WebSocket.Server({ port: 8000 });
// let userConnections = new Map();

// wss.on('connection', (ws) => {
//   const userID = 'a06cde980c3ca7f4'

//   if (userID) {
//       userConnections.set(userID, ws); // Store WebSocket connection for the user
//       console.log(`User ${userID} connected`);
//   }

//   // console.log('Client connected to WebSocket');
//   // clients.push(ws);

//      // Listen for messages from the client
//      ws.on('message', (message) => {
//         const data = JSON.parse(message.toString());

//         if (data.type === 'auth_success') {

//           sendToUser(userID, data)
          
//         }
//       });

//       // Send a message to the client
//       ws.send(JSON.stringify({ message: 'Hello from WebSocket server!' }));

//       ws.on('close', () => {
//         userConnections.delete(userID); // Remove the user on disconnect
//         console.log(`User ${userID} disconnected`);
//     });

// });

// function sendToUser(userID, data) {
//   const ws = userConnections.get(userID);
//   if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify(data));
//   }
// }



// CORS configuration for uploads
app.use('/uploads', cors({
    origin: `${process.env.FRONTEND_URL}`, // Replace with your Vue.js front-end URL
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true  // Use a specific origin if credentials are needed
}), express.static(path.join(__dirname, 'uploads')));

// General CORS configuration for API routes
const corsOptions = {
    origin: `${process.env.FRONTEND_URL}`, // Specify your front-end URL
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
};
app.use(cors(corsOptions));




app.use(helmet());

app.use(express.json())

// app.use(bodyParser.json());




const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});

app.use(limiter);

const sequelize = require('./config/sequelize');

// Test the database connection and sync the User model
sequelize.authenticate()
  .then(() => {
      console.log('Database connected...');
      return sequelize.sync();  // Sync all defined models to the database
  })
  .then(() => {
      console.log('User model synced with the database.');
  })
  .catch(err => {
      console.error('Unable to connect to the database:', err);
  });

  // require('./middlewares/oauthMiddleware')
//   app.get('/api/auth/me-logout', (req, res) => {
//     // req.logout()
//     // res.send('Logged out')
//     console.log(req)
// });

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',  // Replace with a secure secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }  // Use secure cookies in production
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', chatRoutes)
app.use('/api/file', uploadRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/agent', agentRoutes)
app.use('/api/favourite', favouriteRoutes)


app.use('/', webRoute)




app.listen(process.env.PORT, () => console.log('Listening on port: ' + process.env.PORT ))