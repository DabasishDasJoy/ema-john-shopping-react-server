const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ema john app is running");
});

app.listen(port, () => {
  console.log("Ema-john server is listenign to ", port);
});

//Database

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.mj0nqa8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const productCollection = client
      .db("emaJohnShopping")
      .collection("products");

    app.get("/products", async (req, res) => {
      const currPage = parseInt(req.query.page);
      const pageSize = parseInt(req.query.size);
      console.log(currPage, pageSize);

      const query = {};

      const cursor = productCollection.find(query);
      const products = await cursor
        .skip(currPage * pageSize)
        .limit(pageSize)
        .toArray();

      //counter
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.post("/productsByIds", async (req, res) => {
      const Ids = req.body;
      const ObjectIds = Ids.map((id) => ObjectId(id));
      const query = { _id: { $in: ObjectIds } };
      const cursor = productCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
};

run().catch(console.dir);
