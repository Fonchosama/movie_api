const express = require('express');
 morgan = require('morgan');
 fs = require('fs'); 
 path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

let topMovies = [
    {
      title: 'Pulp Fiction',
      author: 'Quentin Tarantino'
    },
    {
      title: 'Rear Window',
      author: 'Alfred Hitchcock'
    },
    {
      title: 'Citizen Kane',
      author: 'Orson Welles'
    },
    {
        title: 'Fight Club',
        author: 'David Fincher'
    },
    {
        title: 'Inception',
        author: 'Christopher Nolan'
    },
    {
        title: 'Forrest Gump',
        author: 'Robert Zemeckis'
    },
    {
        title: 'The Matrix',
        author: 'Wachowski Brothers'
    },
    {
        title: 'Se7en',
        author: 'David Fincher'
    },
    {
        title: 'Terminator 2: Judgment Day',
        author: 'James Cameron'
    },
    {
        title: 'Gladiator',
        author: 'Ridley Scott'
    }
  ];

  let topBooks = [
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling'
    },
    {
      title: 'Lord of the Rings',
      author: 'J.R.R. Tolkien'
    },
    {
      title: 'Twilight',
      author: 'Stephanie Meyer'
    }
  ];
  
  
  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my Movie Data Base!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });

  app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  app.get('/Books', (req, res) => {
    res.json(topBooks);
  });

  app.get('/movies', (req, res) => {
    res.send("Successful GET request returning data of all movies");
  });

  app.get("/movies/:name", (req, res) =>{
    res.send("Successful GET request returning data of an specific movie")
  });

  app.get("/genres/:name", (req, res) =>{
    res.send("Successful GET request returning data about a genre")
  });

  app.get("/directors/:name", (req, res) =>{
    res.send("Successful GET request returning data about a director")
  });

 
  //POST request 

  app.post("/users/register", (req, res) =>{
    res.send("Successful POST request to register a new user")
  });

 //PUT requests 
  
 app.put("/users/:username", (req, res) =>{
  res.send("Successful PUT request to update the username")
});

app.put("/users/:username/favorites", (req, res) =>{
  res.send("Successful PUT request to add a movie to user favorites list")
});

  //DELETE request 

  app.delete("/users/:username/favorites", (req, res) =>{
    res.send("Successful DELETE request to delete a movie from the list of favorites")
  });

  app.delete("/users/:username", (req, res) =>{
    res.send("Successful DELETE request to delete an existing user")
  });

  // Serve static files from the "public" directory
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });