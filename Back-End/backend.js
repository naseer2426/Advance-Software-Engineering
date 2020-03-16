var express = require("express");
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
var app = express();
const PORT = 8000;
app.use(cors);
app.use(bodyParser.json());

const uri =
    "mongodb+srv://Naseer-test:Twofourtwosix2426@naseers-cluster-vehee.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var users;
var courses;
client.connect(err => {
    if (err != null) {
        console.log(err);
    }
    users = client.db("frats").collection("users");
    courses = client.db("frats").collection("courses");
    console.log("Connected to mongo boi");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/models/:url", (req, res) => {
    res.sendFile(__dirname + "/models/" + req.params.url);
});

app.get("/faces/:url", (req, res) => {
    res.sendFile(__dirname + "/faces/" + req.params.url);
});

app.get("/:path", (req, res) => {
    res.sendFile(__dirname + "/" + req.params.path);
});

app.post("/authenticate", (req, res) => {
    users.find().toArray((err, docs) => {
        var username = req.body.username;
        var password = req.body.password;

        for (var i = 0; i < docs.length; i++) {
            var currUser = docs[i];

            if (
                currUser.username == username &&
                currUser.password == password
            ) {
                res.status(200);
                return res.send(currUser);
            }
        }

        res.status(400);
        return res.send({ error: "Wrong Email or Password" });
    });
});
// app.get("/face-api.js", (req, res) => {
//     res.sendFile(__dirname + "/face-api.js");
// });

app.listen(PORT, () => {
    console.log("Running");
});
