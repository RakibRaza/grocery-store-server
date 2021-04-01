const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jljnw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const productCollection = client
    .db(process.env.DB_NAME)
    .collection("products");
  const orderCollection = client.db(process.env.DB_NAME).collection("orders");
  // Get Products
  app.get("/products", (req, res) => {
    productCollection
      .find({})
      .toArray((err, collection) => res.send(collection));
  });
  // Get single Products
  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, collection) => res.send(collection));
  });

  // Add Product
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection
      .insertOne(product)
      .then((result) => res.send(result.insertedCount > 0));
  });

  // Place Orders
  app.post("/placeOrders", (req, res) => {
    const orders = req.body;
    orderCollection
      .insertOne(orders)
      .then((result) => res.send(result.insertedCount > 0));
  });
  // Get Orders By Email
  app.get("/orders", (req, res) => {
    orderCollection
      .find({ email: req.query.email })
      .toArray((err, collection) => {
        res.send(collection);
      });
  });
  // Delete product from database
  app.delete("/deletePproduct/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => res.send(result.deletedCount > 0));
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App listening at PORT${port}`);
});
