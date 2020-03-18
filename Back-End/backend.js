var express = require("express");
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

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
var students;
client.connect(err => {
    if (err != null) {
        console.log(err);
    }
    users = client.db("frats").collection("users");
    courses = client.db("frats").collection("courses");
    students = client.db("frats").collection("students");
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

app.get("/courses", async (req, res) => {
    var courseID = req.query.course;

    courses.find({ _id: ObjectId(courseID) }).toArray((err, docs) => {
        res.status(200);
        res.send(docs[0]);
    });
});

app.get("/students", async (req, res) => {
    students.find().toArray((err, docs) => {
        res.send(docs);
    });
});

app.get("/professors", async (req, res) => {
    users.find().toArray((err, docs) => {
        var professors = [];

        for (var i = 0; i < docs.length; i++) {
            var currUser = docs[i];
            if (currUser.role == "Professor") {
                professors.push(currUser);
            }
        }

        res.send(professors);
    });
});

app.get("/start_attendance", async (req, res) => {
    courses
        .find({ _id: ObjectId("5e7005753d9cda4d3e1ff2bb") })
        .toArray(async (err, docs) => {
            var aiCourse = docs[0];
            var dayDetails = {
                "Total Students": 5,
                "Total Present": 0,
                "Total Absent": 5,
                Students: { Present: [], Absent: [] }
            };
            dayDetails["id"] = new Date().toDateString();

            aiCourse["dates"] = [{ 0: dayDetails }];
            var response = await courses.updateOne(
                { _id: ObjectId("5e7005753d9cda4d3e1ff2bb") },
                { $set: aiCourse }
            );
            res.send(response);
        });
});

app.get("/mark_attendance/:userid", async (req, res) => {
    var userId = req.params.userid;
    courses
        .find({ _id: ObjectId("5e7005753d9cda4d3e1ff2bb") })
        .toArray(async (err, docs) => {
            var aiCourse = docs[0];
            aiCourse["dates"][0]["0"]["Total Present"] += 1;
            aiCourse["dates"][0]["0"]["Total Absent"] -= 1;
            students.find({ name: userId }).toArray(async (err, docs) => {
                var studentDetails = docs[0];
                var studentMarked = false;

                for (
                    var i = 0;
                    i < aiCourse["dates"][0]["0"]["Students"]["Present"].length;
                    i++
                ) {
                    var currPresentStudent =
                        aiCourse["dates"][0]["0"]["Students"]["Present"][i];
                    if (currPresentStudent["name"] == userId) {
                        studentMarked = true;
                    }
                }
                if (!studentMarked) {
                    aiCourse["dates"][0]["0"]["Students"]["Present"].push(
                        studentDetails
                    );
                    var response = await courses.updateOne(
                        { _id: ObjectId("5e7005753d9cda4d3e1ff2bb") },
                        { $set: aiCourse }
                    );
                } else {
                    response = { success: "Student already marked" };
                }
                res.send(response);
            });
        });
});

app.get("/end_attendance", async (req, res) => {
    students.find().toArray((err, docs) => {
        var allStudents = docs;
        courses
            .find({ _id: ObjectId("5e7005753d9cda4d3e1ff2bb") })
            .toArray(async (err, docs_course) => {
                var aiCourse = docs_course[0];
                var presntStudents =
                    aiCourse["dates"][0]["0"]["Students"]["Present"];
                for (var i = 0; i < allStudents.length; i++) {
                    var currStudent = allStudents[i];
                    studentAbsent = true;
                    for (var j = 0; j < presntStudents.length; j++) {
                        var currPresentStudent = presntStudents[j];
                        if (currPresentStudent["name"] == currStudent["name"]) {
                            studentAbsent = false;
                            break;
                        }
                    }
                    if (studentAbsent) {
                        aiCourse["dates"][0]["0"]["Students"]["Absent"].push(
                            currStudent
                        );
                    }
                }
                var response = await courses.updateOne(
                    { _id: ObjectId("5e7005753d9cda4d3e1ff2bb") },
                    { $set: aiCourse }
                );
                res.send(response);
            });
    });
});

app.post("/make_course", async (req, res) => {
    var name = req.body.name;
    var profId = req.body.profId;
    var course = { name: name, url: "https://picsum.photos/200", dates: [] };
    var response = await courses.insertOne(course);
    // console.log(response);
    users.find({ _id: ObjectId(profId) }).toArray(async (err, docs) => {
        var prof = docs[0];
        prof.courses.push(response.insertedId.toString());
        await users.updateOne({ _id: ObjectId(profId) }, { $set: prof });
    });
    users
        .find({ _id: ObjectId("5e6fd7d73d9cda4d3e1ff2b9") })
        .toArray(async (err, docs) => {
            var admin = docs[0];
            admin.courses.push(response.insertedId.toString());
            await users.updateOne(
                { _id: ObjectId("5e6fd7d73d9cda4d3e1ff2b9") },
                { $set: admin }
            );
        });
    res.send(response);
});

// app.get("/:path", (req, res) => {
//     res.sendFile(__dirname + "/" + req.params.path);
// });
// app.get("/face-api.js", (req, res) => {
//     res.sendFile(__dirname + "/face-api.js");
// });

app.listen(PORT, () => {
    console.log("Running");
});
