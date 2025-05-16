const express = require('express');
const app = express();
const port = 3000;

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
    else{ res.status(400).json({error: "name already exists"})}
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
  
  /* POST - retry API
  - Simulate an unreliable API that fails randomly
  - Retry up to 3 times with delay
  - Return success or give up
  */
    app.post('/retry')



// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
