const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET route
app.get("/health", (req, res) => {
  res.send("Ok");
});

// start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
