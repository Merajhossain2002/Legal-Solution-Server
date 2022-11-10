const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
async function run() {
  try {
    const servicesCollection = client
      .db("legalServices")
      .collection("services");
    const usersCollection = client.db("legalServices").collection("users");

    app.get("/services", async (req, res) => {
      const query = {};
      const options = {
        sort: { serviceName: -1 },
      };
      const cursor = servicesCollection.find(query, options).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });

    app.get("/allservices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const allservices = await cursor.toArray();
      res.send(allservices);
    });

    app.get("/myreview/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const myreview = await usersCollection.findOne(query);
      console.log(myreview);
      res.send(myreview);
    });



    app.get("/services/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.put("/addreview", async (req, res) => {
      const reviewDetails = req.body;
      const uid = reviewDetails.uid;
      const id = reviewDetails.serviceId;
      const query = { uid: uid };
      const queryTwo = { _id: ObjectId(id) };
      const result = await usersCollection.updateOne(query, {
        $push: { userReview: reviewDetails },
      });
      const resultTwo = await servicesCollection.updateOne(queryTwo, {
        $push: { serviceReviews: reviewDetails },
      });
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
// initial api's
app.get("/", (req, res) => {
  res.send("legal solution server is running");
});

app.listen(port, () => {
  console.log(`legal solution server is running on port ${port}`);
});
