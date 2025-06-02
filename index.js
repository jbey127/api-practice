const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;


async function makePostRequest(url, postData) {
  try {
    const response = await axios.post(url, postData);
    return response.data;
  } catch (error) {
    console.error("Error in makePostRequest:", error.response ? error.response.data : error.message);
    throw error; // Re-throw to maintain consistent error handling
  }
}

async function makeGetRequest(url) {
  try {
    console.log("Making GET request to:", url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in makeGetRequest:", error.response ? error.response.data : error.message);
    throw error;
  }
}

app.use(express.json()); // Middleware to parse JSON

//Level 1 - Very Basic Requests in memory data

    // In-memory data store
      let items = [
        { id: 1, name: 'Item One' },
        { id: 2, name: 'Item Two' }
      ];

    // GET - Retrieve all items from in mem data story
    app.get('/items', (req, res) => {
      res.json(items);
    });

    // POST - Add a new item
    app.post('/items', (req, res) => {
      const newItem = {
        id: items.length + 1,
        name: req.body.name
      };
    let match = items.find((obj) => obj.name == newItem.name)
    if(match){
      items.push(newItem);
      res.status(201).json(newItem);
    }
    else{res.status(400).json({
      status: 400,
      message: "name already exists"})}
    });

    // PUT - Update an existing item by ID
    app.put('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items[itemIndex].name = req.body.name;
  res.json(items[itemIndex]);
});

// Level 2 - Fundamental Projects
  
  /* GET - retry API
  - Simulate an unreliable API that fails randomly
  - Retry up to 3 times with delay
  - Return success or give up
  */
    app.get('/retry', async (req, res)=>{
      let url = "http://localhost:3001/unreliable-api"
  
      let retrycount = 0
      while(retrycount <= 3){
      try{
        console.log("Attempting to make request...")
        let response = await makeGetRequest(url)
        console.log("Response received:", response)
        
        if(response.data.message === "retry"){
          console.log("Got retry message. Retry Count:", retrycount)
          retrycount++
        }
        else if(response.data.message === "success"){
          console.log("Got success message")
          res.status(200).json({message: "success", retrycount: retrycount})
          break

        }
        else {
          console.log("Unexpected response:", response)
          res.status(400).json({message: "Unexpected response", retrycount: retrycount})
          retrycount++
        }
      }
      catch(error){
        console.log("Error caught:", error)
      }
    }
    if(retrycount > 3){
    res.status(400).json({message: "Retries Exceeded", retrycount: retrycount})
  }
  })  

  /* */



// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
