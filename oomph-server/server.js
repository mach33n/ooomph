const express = require('express');
const bodyparse = require('body-parser');
const app = express();
const cors = require('cors');
const port = 3000;

const client = require('mongodb').MongoClient

const server = require('http').createServer(app);
var WebSocketServer = require('websocket').server;

app.use(bodyparse.json({ extended: true }));
app.use(cors());

// instantiate a connection to our new driver through application
var wss = new WebSocketServer({httpServer: server})
var storedSockets = {}

// Kinda ugly but just encompasses all mongodb client stuff
client.connect('mongodb+srv://oomph:oomph@oomph-test-cluster.qytdu.mongodb.net/oomph?retryWrites=true&w=majority', {
    useUnifiedTopology: true}).then(client =>{
        // reference to collection in oomph db is drivers
        const db = client.db('oomph');
        const driversdb = db.collection('drivers');

        // Handles updating driver location and ensuring driver is in app to recieve notifs
        wss.on('request',(request) => {
            console.log('Connection')
            var connection = request.accept(null, request.origin);
            var name;
            //storedSockets[connection.remoteAddress] = connection
            connection.on('message', (req) => {
                var data = JSON.parse(req.utf8Data)
                if (data.type == "locUpdate") {
                    name = data.name
                    driversdb.updateOne({ name: data.name }, { $set: {
                        "location": { type: "Point", coordinates: [data.long, data.lat] },
                        active: data.active
                    }}).catch(err => {
                        console.log(err);
                    })
                }
            })
            connection.on('close', () => {
                driversdb.updateOne({ name: name }, { $set: {
                    active: false
                }}).catch(err => {
                    console.log(err);
                })
            })
        })

        app.post('/newdriver', (req, res) => {
            driversdb.insertOne({
                name: req.body.name,
                licensePlate: req.body.licensePlate,
                capacity: req.body.capacity,
                active: true
              }).then(() => {
                console.log('Requested')
                res.send('New Driver made');
            }).catch(err => {
                console.log(err)
            })
        })

        app.post('/getDriver', (req,res) => {
            driversdb.createIndex({location:"2dsphere"});
            var ret = driversdb.findOne({ active: {$eq: true}}, {
                "location": {
                    $near: {
                        $geometry:
                            // For some reason you gotta set coordinates [lat, lng]
                            { type: "Point", coordinates: [req.body.long, req.body.lat] }
                    }
                }
            }
            ).then(item => {
                if (item) {
                    res.send(item)
                }
            })
        })
        
        server.listen(port, () => console.log('listening on port: ' + port))
    }).catch(err => {
        console.log(err);
    })