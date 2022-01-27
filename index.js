const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('This is Saha-Motors server')
})

app.listen(port, () => {
    console.log('Saha Motors Server listening at', port)
})