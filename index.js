const express = require('express')
const { MongoClient } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.json())

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imkxn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run() {
  try {
    await client.connect();
    const database = client.db("sahaMotors");
    const productsCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const usersCollection = database.collection("users");


    //get API
    app.get('/allProducts', async (req, res) => {
      const cursor = productsCollection.find({})

      const result = await cursor.toArray();
      res.json(result)
    })
    app.get('/orders', async (req, res) => {
      const cursor = orderCollection.find({})
      const result = await cursor.toArray()
      res.json(result)
    })
    app.get('/singleProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.json(result)
    })
    app.get('/myOrder', async (req, res) => {
      const email = req.query.email;
      console.log(email)
      const query = { email: email }
      const cursor = orderCollection.find(query)

      const order = await cursor.toArray()

      res.json(order)
    })
    app.get('/users/:email', async (req, res) => {

      const email = req.params.email;
      const query = { email: email };
      const user = usersCollection.find(query)

      const result = await user.toArray()
      // res.json(result)

      let isAdmin = false;
      if (result[0]?.role === 'Admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin })
    })

    //post API
    app.post('/addProduct', async (req, res) => {
      const product = req.body;

      const result = await productsCollection.insertOne(product);

      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result)
    })
    app.post('/placeOrder', async (req, res) => {
      const order = req.body;

      const result = await orderCollection.insertOne(order)
      console.log(result)
      res.json(result)
    })
    app.post('/addUser', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      console.log(result)
      res.json(result)
    })
    //update API
    app.put('/addUser', async (req, res) => {
      const user = req.body;
      const filter = { email: user?.email }
      const options = { upsert: true };
      const updateDoc = { $set: user }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.json(result)

    })
    app.put('/addAdmin', async (req, res) => {
      const user = req.body;
      const filter = { email: user?.email };
      const updateDoc = { $set: { role: 'Admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.json(result)


    })
    app.put('/updateOrderStatus/:id', async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: ObjectId(id) }

      const updateDoc = {
        $set: {
          status: body?.status
        }
      }
      const result = await orderCollection.updateOne(filter, updateDoc)
      console.log(result)
      res.json(result)

    })
    //delete API

    app.delete('/deleteOrder/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      res.json(result)

    })
    app.delete('/deleteProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await productsCollection.deleteOne(query)
      res.json(result)
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to Saha-Motors server')
})

app.listen(port, () => {
  console.log('Saha Motors Server listening at', port)
})