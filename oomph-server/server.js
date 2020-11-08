const express = require('express');
const bodyparse = require('body-parser');
var server = express();
var cors = require('cors');
const port = 3000;

const client = require('mongodb').MongoClient

server.use(bodyparse.json({ extended: true }));
server.use(cors());

client.connect('mongodb+srv://oomph:oomph@oomph-test-cluster.qytdu.mongodb.net/oomph?retryWrites=true&w=majority', {
    useUnifiedTopology: true}).then(client =>{
        const db = client.db('oomph');
        const driversdb = db.collection('drivers');

        server.post('/newdriver', (req, res) => {
            driversdb.insertOne({
                name: req.body.name,
                licensePlate: req.body.licensePlate,
                capacity: req.body.capacity
              }).then(() => {
                console.log('Requested')
                res.send('Ride has been requested');
            }).catch(err => {
                console.log(err)
            })
        })

        server.post('/coordUpd', (req,res) => {
            driversdb.updateOne({ name: req.body.name }, { $set: {
                lat: req.body.lat,
                long: req.body.long,
            }}).then(() => {
                res.send('Update Recieved');
            }).catch(err => {
                console.log(err);
            })
        })

        server.post('/getDriver', (req,res) => {
            driversdb.createIndex({location:"2dsphere"});
            driversdb.find({
                "location": {
                    $near: {
                        $geometry:
                            // For some reason you gotta set coordinates [lat, lng]
                            { type: "Point", coordinates: [req.body.lat, req.body.long] }
                    }
                }
            }
            ).forEach((item) => {
                res.send(item);
            })
        })

        server.get('/drivers/count', (req, res) => {
            res.send('12')
        })

        server.listen(port, () => console.log('listening on port: ' + port))
    }).catch(err => {
        console.log(err);
    })