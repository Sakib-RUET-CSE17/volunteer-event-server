const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
// console.log(process.env.DB_NAME)//db_name -- not case-sensitive
const port = process.env.PORT || 5055

app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejoil.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
    const eventCollection = client.db("volunteer").collection("events");

    app.get('/events', (req, res) => {
        eventCollection.find({})
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body
        console.log('adding new event:', newEvent)
        eventCollection.insertOne(newEvent)
            .then(result => {
                console.log('inserted Count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        console.log('delete this', id)
        eventCollection.findOneAndDelete({ _id: id })
            .then(documents => res.send(!!documents.value))
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)