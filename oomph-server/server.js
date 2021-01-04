const express = require("express");
const app = express();
const cors = require('cors');
const port = 3000;

var ObjectID = require('mongodb').ObjectID; 
const client = require('mongodb').MongoClient;

const server = require('http').createServer(app);
var WebSocketServer = require('websocket').server;

app.use(bodyparse.json({ extended: true }));
app.use(cors());

// instantiate a connection to our new driver through application
var wss = new WebSocketServer({httpServer: server})
var storedSockets = {};
var storedConnections = {};

// Kinda ugly but just encompasses all mongodb client stuff
client.connect('mongodb+srv://oomph:oomph@oomph-test-cluster.qytdu.mongodb.net/oomph?retryWrites=true&w=majority', {
    useUnifiedTopology: true}).then(client =>{
        // reference to collection in oomph db is drivers
        const db = client.db('oomph');
        const driversdb = db.collection('drivers');
        const usersdb = db.collection('users');
        
        // Handles updating driver location and ensuring driver is in app to recieve notifs
        wss.on('request',(request) => {
            var connection = request.accept(null, request.origin);
            var name;

            console.log('New Connection')
            
            // updates location of driver using websocket
            connection.on('message', (req) => {
                var data = JSON.parse(req.utf8Data)
                
                if (data.type == "intro") {
                    storedSockets[data.id] = connection
                    storedConnections[connection] = data.id
                    
                    console.log(data.id)
                    console.log(Object.keys(storedSockets))

                    driversdb.updateOne({ _id: ObjectID(storedConnections[connection]) }, { $set: {
                        "active": true
                    }}).catch(err => {
                        console.log(err);
                        // User must not be a driver in database or something.
                        connection.close();
                    })
                }
                
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

            // Currently just setting drivers as inactive when they're not on app
            connection.on('close', () => {
                console.log('Connection Sever: ')
                console.log(storedConnections)
                //storedConnections[connection].close();
                driversdb.updateOne({ _id: ObjectID(storedConnections[connection]) }, { $set: {
                    "active": false
                }}).catch(err => {
                    console.log(err);
                })
            })
        })

        app.post('/test', (req, res) => {
            console.log("Hello");
            console.log(req);
            usersdb.insertOne({
                eduEmail: req.body.eduEmail,
                password: req.body.password
            })
            res.send('POST request to homepage')
        })
        
            // Endpoint for signing up a new user
        app.post('/newuser', (req, res) => {
             usersdb.insertOne({
                eduEmail: req.body.eduEmail,
                password: req.body.password
                }, (err, docs) => {
                    try {
                        console.log(res);
                    } catch {
                        console.log(err);
                    }
                })
            })

        app.post('/getuser', (req, res) => {
            var verified = usersdb.findOne({eduEmail: req.body.eduEmail,
            password: req.body.password}, (err, docs) => {
                    try {
                        if (verified) {
                            console.log('User is verified');
                        } else {
                            console.log('User is not verified');
                        }

                    } catch {
                        console.log(err);
                    }
                })
            })    
        app.post('/removeDriver', (req, res) => {
            console.log('Got request')
            console.log(req.body)
            try {
                driversdb.deleteOne({
                    "_id": new ObjectID(req.body.id)
                })
                res.send(req.body.id)
            } catch (e) {
                console.log(e)
            }
        })
        
        // Endpoint for signing up a new driver
        app.post('/newdriver', (req, res) => {
            console.log('New Driver')
            driversdb.insertOne({
                name: req.body.name,
                licensePlate: req.body.licensePlate,
                capacity: req.body.capacity,
                active: true
                }, (err, docs) => {
                    try {
                        storedSockets[docs.insertedId.toString()] = {}
                        res.send({'id': docs.insertedId})
                    } catch {
                        console.log(err)
                    }
                })
            })

            app.post('/verifyDriver', async (req, res) => {
                console.log('HERE AT ALL');
                console.log(req.body.id);
                driversdb.findOne({
                    _id: ObjectID(req.body.id)
                }).then((item) => {
                    console.log('Here')
                    console.log(item)
                    if (!item) {
                        driversdb.insertOne({
                            _id: ObjectID(req.body.id),
                            name: req.body.name,
                            licensePlate: req.body.licensePlate,
                            capacity: req.body.capacity,
                            active: true
                            }, (err, docs) => {
                                try {
                                    storedSockets[docs.insertedId.toString()] = {}
                                    res.send({'id': docs.insertedId})
                                } catch {
                                    console.log(err)
                                }
                            })
                    }
                    res.send({})
                }).catch((err) => {
                    console.log(err)
                    res.send(err)
                })
            })
            

            // Endpoint for requesting nearest driver for request
            app.post('/getDriver', (req,res) => {
                console.log('Here')
                driversdb.createIndex({location:"2dsphere"});
                driversdb.findOne({ active: {$eq: true}}, {
                    "location": {
                        $near: {
                            $geometry:
                                // For some reason you gotta set coordinates [lat, lng]
                                { type: "Point", coordinates: [req.body.long, req.body.lat] }
                        }
                    }
                }).then(item => {
                    if (item) {
                        var msg = {
                            type:'alert',
                            lat: req.body.lat,
                            long: req.body.long,
                            flat: req.body.flat,
                            flon: req.body.flon,
                        }
                        console.log('ride request')
                        console.log(msg)
                        storedSockets[item._id].send(JSON.stringify(msg))
                        res.send(JSON.stringify(item))
                    } else {
                        res.send('no')
                    }
                })
            })
        
        server.listen(port, () => console.log('listening on port: ' + port))
    }).catch(err => {
        console.log(err);
    })
// This is a sample test API key. Sign in to see examples pre-filled with your key.
const stripe = require("stripe")("sk_test_51I1mxPFIfZqwb5IQzX5I3x38VtzfB8sFIo8atMOT8DTZ1mFAxz1wl1W5vHta2YzswP5wR5Gut7Jtwjp21LjuJFGY00kH3c5jCW");

app.use(express.static("."));
app.use(express.json());

const calculateRideAmount = ride => {
    //replace this const value with pricing function 
    return 5;
}

app.post("/create-payment-intent", async (req, res) => {
    const {ride} = req_body; 
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateRideAmount(ride),
        currency: "usd",
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
