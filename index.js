const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//* middle wears
app.use(cors());
app.use(express.json());

//*? connected to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k5v5ibx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// initial api's
app.get("/", (req, res) => {
  res.send("legal solution server is running");
});

app.listen(port, () => {
  console.log(`legal solution server is running on port ${port}`);
});
