let random = Math.round(Math.random())

const express = require('express');
const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON


    // GET - Retrieve all items from in mem data story
    app.get('/unreliable-api', (req, res) => {
        let random = Math.round(Math.random())
        if (random == 1){
            return res.status(200).json({data: {message: "success"}})
        }
        else{
            return res.status(400).json({data: {message: "error, retry"}})
        }
    });