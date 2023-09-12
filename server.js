const express = require("express");
const app = express();
const server = require("http").Server(app);
const port = process.env.PORT || 3030;
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
app.use(express.static("public"));
app.use(bodyParser());
app.set("view engine", "ejs");

MongoClient.connect(uri, {serverApi: {version: ServerApiVersion.v1, strict: true, deprecationErrors: true,}})
    .then(async client => {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db("my-mongo");
        const usersDB = db.collection("users-mongodb");

        app.get('/', (req, res) => {
            try {
                usersDB.find().toArray()
                    .then(results => {
                        res.render("home", {user_data: results});
                    })
                    .catch(console.error)
            } catch (error) {
                console.log(error);
                res.render("home", {error_txt: error});
            }
        });

        app.post('/', (req, res) => {
            try {
                usersDB.insertOne(req.body)
                    .then(result => {
                        res.redirect('/');
                    })
                    .then(console.error)
            } catch (error) {
                console.log(error);
                res.redirect('/');
            }
        });

        server.listen(port, () => console.log(`Active on ${port} port`));
})