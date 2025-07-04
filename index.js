/*
Latest Update: I realized I want to fully build out the get, post, and put endpoints as pages of the app.
From there everything I will be doing will mostly focus on backend. After I finish looking into 
the post app page 
*/ 
require('dotenv').config();
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? 'API Key exists' : 'API Key missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'API Secret exists' : 'API Secret missing'
});
const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const unreliableApiUrl = process.env.UNRELIABLE_API_URL || "http://localhost:3001/unreliable-api";
makeGetRequest = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in makeGetRequest:", error.response ? error.response.data : error.message);
    throw error;
  }
}

// Import routes
const imageRoutes = require('./routes/images');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Use routes
app.use('/api', imageRoutes);

// Unreliable API endpoint
app.get('/unreliable-api', (req, res) => {
  let random = Math.round(Math.random())
  console.log('Unreliable API called, random value:', random);
    if (random == 1){
        return res.status(200).json({data: {message: "success", live: "true"}})
    }
    else{
        return res.status(200).json({data: {message: "retry", live: "false"}})
    }
});


// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use(express.json()); // Middleware to parse JSON

//Pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

app.get('/retry', (req, res)=>{
  res.sendFile(__dirname + '/public/retry.html')
})
app.get('/loan-calc', (req,res)=>{
  res.sendFile(__dirname + '/public/loan-calculator.html')
})

/*Level 1 - Very Basic Requests in memory data
  This level will conduct basic API calls for all the methods. It also includes 
*/


// display Items page 
app.get('/items', (req, res) => {
  res.sendFile(__dirname + '/public/items.html')
});

// In-memory data store
let items = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' }
];
// GET - API endpoint for items data
  app.get('/api/items', (req, res) => {
            res.json(items);
          });
app.get('/post-items', (req, res)=>{
  res.sendFile(__dirname + '/public/items-post.html')
})
    // POST - Add a new item
    app.post('/api/post-items', (req, res) => {
      const newItem = {
        id: items.length + 1,
        name: req.body.name
      };
    console.log(newItem)
    let match = items.findIndex((obj) => obj.name == newItem.name)
    if(match == -1){
      items.push(newItem);
      res.status(201).json(items);
    }
    else{res.status(400).json({
      status: 400,
      message: "name already exists"})}
    });


    // PUT - Update an existing item by ID
    app.put('/api/put-items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items[itemIndex].name = req.body.name;
  res.json(items[itemIndex]);
});

// Level 2 - Fundamental Projects will require auth
  
  /* GET - retry API backoff logic
  - Simulate an unreliable API that fails randomly
  - Retry up to 3 times with delay
  - Return success or give up
  */
    app.get('/retry-data', async (req, res)=>{
      console.log('Received request to /retry-data');
      // Use the full URL including the protocol and host
      let url = `http://${req.headers.host}/unreliable-api`;
      console.log('Making request to:', url);
  
      let retrycount = 0;
      let attempts = [];
      while(retrycount <= 3){
        try{
          console.log("Attempting to make request...");
          let response = await makeGetRequest(url);
          console.log("Response received:", response);
          
          //Failure case
          if(response.data.message === "retry"){
            console.log("Got retry message. Retry Count:", retrycount)
            attempts.push({
              attempt: retrycount + 1,
              status: "retry",
              message: "Retry requested",
              timestamp: new Date().toISOString()
            })
            retrycount++
          }
          //Success case
          else if(response.data.message === "success"){
            console.log("Got success message")
            attempts.push({
              attempt: retrycount + 1,
              status: "success",
              message: "Success!",
              timestamp: new Date().toISOString()
            })
            console.log('Sending success response:', {
              message: "success", 
              retrycount: retrycount,
              attempts: attempts
            });
            return res.status(200).json({
              message: "success", 
              retrycount: retrycount,
              attempts: attempts
            })
          }
          //Unexpected response case
          else {
            console.log("Unexpected response:", response)
            attempts.push({
              attempt: retrycount + 1,
              status: "error",
              message: "Unexpected response",
              timestamp: new Date().toISOString()
            })
            console.log('Sending error response:', {
              message: "Unexpected response", 
              retrycount: retrycount,
              attempts: attempts
            });
            return res.status(400).json({
              message: "Unexpected response", 
              retrycount: retrycount,
              attempts: attempts
            })
          }
        }
        //Error case
        catch(error){
          console.log("Error caught:", error)
          attempts.push({
            attempt: retrycount + 1,
            status: "error",
            message: error.message,
            timestamp: new Date().toISOString()
          })
          retrycount++
        }
      }
      
      // If we get here, we've exceeded retry count
      console.log('Sending retries exceeded response:', {
        message: "Retries Exceeded", 
        retrycount: retrycount,
        attempts: attempts
      });
      return res.status(400).json({
        message: "Retries Exceeded", 
        retrycount: retrycount,
        attempts: attempts
      })
    }) 

    // Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
