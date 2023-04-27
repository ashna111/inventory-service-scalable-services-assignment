const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const app = express();
const port = 5003;

const secret = "314781839wjd3190u4edn13ed381de31bfu13ii"


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://productmanagement:productmanagement@cluster0.tch1uh5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET route
app.get("/health", (req, res) => {
  res.json({ Health: "Okay" });
});

app.post("/inventory", async(req, res) => {
  const { productName, quantity } = req.body
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    // If the token is valid, save the user details to the request object
    req.user = decoded;
    const db = client.db('product-management');
    const inventoryCollection = db.collection('inventory');
    const inventory = await inventoryCollection.find({ productName }).toArray();
    if(inventory[0].productName && inventory[0].stock>=Number(quantity)){
      res.send(true)
    }
    else {
      res.send(false)
    }
  });
});


app.patch("/inventory", async(req, res) => {
  const { productName, quantity } = req.body
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    // If the token is valid, save the user details to the request object
    req.user = decoded;
    const db = client.db('product-management');
    const inventoryCollection = db.collection('inventory');
    const inventory = await inventoryCollection.find({ productName }).toArray();
    const inventoryUpdate = await inventoryCollection.updateOne({ productName }, { $set: { stock: (inventory[0].stock-Number(quantity)) } });
    if(inventoryUpdate){
      res.send(true)
    }
    else {
      res.send(false)
    }
  });
});

// start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
