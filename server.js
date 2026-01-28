const { MongoClient } = require('mongodb');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/API');
const interactionsRoutes = require('./routes/interactions');

const app = express();

    // Set up EJS templating engine
    app.set('view engine', 'ejs');
    app.use(express.static('views')); // Serve static files from 'views' folder
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // Serve static CSS
    app.use('/styleee.css', (req, res) => {
      res.setHeader('Content-Type', 'text/css');
      res.sendFile(path.join(__dirname, 'views', 'css/styleee.css'));
    });

    // Use your routes
    app.use('/', indexRoutes);
    app.use('/API', apiRoutes);
    app.use('/', interactionsRoutes);

    // Check if cookies are being set correctly
   
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
      console.log(`The server is running on port ${PORT} & connected to MongoDB`);
    })

