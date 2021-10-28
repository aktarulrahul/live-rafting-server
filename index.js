const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mz66b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function mongodbCURD() {
  try {
    /* ------------------------------------- 
     checking connection with DB
    ------------------------------------- */
    await client.connect();
    console.log('db connected');
    /* ------------------------------------- 
    database name and collection init
    ------------------------------------- */
    const database = client.db('liveRafting');
    const bookingCollection = database.collection('bookings');
    const raftingPackageCollection = database.collection('raftingPackages');
    /* ------------------------------------- 
    GET All Rafting Package API
    ------------------------------------- */
    app.get('/rafting-packages', async (req, res) => {
      const cursor = raftingPackageCollection.find({});
      const raftingPackages = await cursor.toArray();
      res.send(raftingPackages);
    });
    /* ------------------------------------- 
    GET Single Rafting Package API
    ------------------------------------- */
    app.get('/rafting-packages/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const raftingPackage = await raftingPackageCollection.findOne(query);
      res.json(raftingPackage);
    });
    /* ------------------------------------- 
    POST Single Rafting Package API
    ------------------------------------- */
    app.post('/rafting-packages', async (req, res) => {
      // Step 1. data
      const raftingPackage = req.body;
      // Step 2. insertOne
      const result = await raftingPackageCollection.insertOne(raftingPackage);
      res.json(result);
    });
    /* ------------------------------------- 
    GET All Booking API
    ------------------------------------- */
    app.get('/booking', async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    });
    /* ------------------------------------- 
    GET Single Booking API
    ------------------------------------- */
    app.get('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query);
      res.json(booking);
    });
    /* ------------------------------------- 
    POST Single Booking API
    ------------------------------------- */
    app.post('/booking', async (req, res) => {
      // Step 1. data
      const bookingInfo = req.body;
      // Step 2. insertOne
      const result = await bookingCollection.insertOne(bookingInfo);
      res.json(result);
    });
    /* ------------------------------------- 
    DELETE Single Booking API
    ------------------------------------- */
    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
    /* ------------------------------------- 
    Update Single Booking Status API
    ------------------------------------- */
    /* ------------------------------------- 
    GET All Users with Camp Booking API
    ------------------------------------- */
    app.get('/booking/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = bookingCollection.find(query);
      const userBookings = await cursor.toArray();
      res.send(userBookings);
    });
  } finally {
    // await client.close();
  }
}

mongodbCURD().catch(console.dir);

// server run
app.get('/', (req, res) => res.send('server runinng'));

app.listen(port, () => console.log(`Running Server on port ${port}`));
