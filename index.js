const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
morgan = require('morgan');
fs = require('fs');
path = require('path');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});
app.use(morgan('combined', { stream: accessLogStream }));

// Connecting to the DB
mongoose.connect('mongodb://127.0.0.1:27017/gianflixdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to GianFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// get all movies
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get a movie by id
app.get('/movies/:movieID', async (req, res) => {
  await Movies.findOne({ _id: req.params.movieID })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Create a new user (used in user signup)
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a User information
app.put('/users/:Username', (req, res) => {
  res.send('Successful PUT request to update the username');
});

// Add a movie to user's favorite list
app.put('/users/:Username/movies/:movieID', (req, res) => {
  res.send('Successful PUT request to add a movie to user favorites list');
});

// Remove a movie from user's favorite list
app.delete('/users/:Username/movies/:movieID', (req, res) => {
  res.send(
    'Successful DELETE request to delete a movie from the list of favorites'
  );
});

// Delete a User
app.delete('/users/:Username', (req, res) => {
  Users.deleteOne({ Username: req.params.Username })
    .then(() => res.status(200).send('Successfully delete the user.'))
    .catch((e) => {
      console.error(e);
      res.status(500).send('Failed to delete the user.');
    });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('GianFlix is listening on port 8080.');
});
