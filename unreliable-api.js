let random = Math.round(Math.random())

const express = require('express');
const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON


    // GET - Retrieve all items from in mem data story
    app.get('/unreliable-api', (req, res) => {

    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });