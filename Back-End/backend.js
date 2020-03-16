var express = require("express");
const cors = require("cors")({ origin: true });
var app = express();
const PORT = 6969;
app.use(cors);
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

// app.get("/face-api.js", (req, res) => {
//     res.sendFile(__dirname + "/face-api.js");
// });

app.listen(PORT, () => {
    console.log("Running");
});
