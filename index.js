const express = require('express')
const { MongoClient } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

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
    // create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }
    const result = await productsCollection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to Saha-Motors server')
})

app.listen(port, () => {
  console.log('Saha Motors Server listening at', port)
})