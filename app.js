require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./moviedex.json')

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next();
  });

app.get('/movie', function handleGetMovies(req, res){
    let response = MOVIEDEX;

    if(req.query.genre){
        response = response.filter(genres => 
            genres.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if(req.query.country){
        response = response.filter(countries => 
            // case insensitive searching
            countries.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if(req.query.avg_vote){
        response = response.filter(votes => 
            votes.avg_vote >= req.query.avg_vote
        )
    }

    res.json(response);
});

app.listen(8001, () => {
    console.log('Express server is listening on port 8001!');
});