const express = require('express');
const bodyparse = require('body-parser');
const server = express();
const port = 3000;

const client = require('mongodb').MongoClient

server.use(bodyparse.urlencoded({ extended: true }))

client.connect('mongodb+srv://oomph:oomph@oomph-test-cluster.qytdu.mongodb.net/oomph?retryWrites=true&w=majority', {
    useUnifiedTopology: true}).then(client =>{
        const db = client.db('oomph');
        const driversdb = db.collection('drivers');
        server.post('/ride', (req, res) => {
            driversdb.insertOne({
                title: 'Post One',
                body: 'Body of post one',
                category: 'News',
                tags: ['news', 'events']
              }).then(result => {
                console.log(result)
                console.log(req.body)
                res.send('Ride has been requested');
            }).catch(err => {
                console.log(err)
            })
        })

        server.get('/drivers/count', (req, res) => {
            res.send('12')
        })

        server.listen(port, () => console.log('listening on port: ' + port))
    }).catch(err => {
        console.log(err);
    })