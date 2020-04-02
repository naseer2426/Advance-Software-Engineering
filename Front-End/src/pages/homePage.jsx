import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import {
    Container,
    Col,
    Row,
    Image,
    Spinner,
    ProgressBar,
    Button
} from "react-bootstrap";
import "./homePage.css";
import Webcam from "react-webcam";
import { authenticationService } from "../services/authenticationService";
import { Role } from "../helpers";
import { FaceRec } from "../Facial-Recognition";
class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            webcamEnabled: false,
            loading: true,
            initializedModel: false,
            scannedPercent: 0,
            scanTime: 3,
            currScan: {
                Naseer: 0,
                Mannan: 0,
                Aditi: 0,
                Jannat: 0,
                Puneet: 0,
                unknown: 0,
                Mannan: 0,
                Kenneth: 0
            },
            matricNumbers: {
                Naseer: "U1722257F",
                Puneet: "U1722127D",
                Mannan: "U1722737F",
                Jannat: "U1722297J",
                Kennet: "U1721316F",
                Aditi: "U1722352F"
            },
            currFace: null,
            faceLabel: null,
            currTop: 0,
            url: "http://localhost:8000"
        };
    }

    enableWebcam = () => {
        this.setState({ webcamEnabled: true });
        fetch(this.state.url + "/start_attendance");
        if (!this.initializedModel) {
            this.setUpFecRec();
            this.initializedModel = true;
        }
        var scanner = this.startScan();
        this.setState({ scanner });
    };

    cancel = () => {
        var scanner = this.state.scanner;
        clearInterval(scanner);
        fetch(this.state.url + "/end_attendance");
        this.setState({ webcamEnabled: false });
    };

    desicionUI = color => {
        var canvas = document.getElementById("overlay");
        if (canvas) {
            console.log("reached");
            var context = canvas.getContext("2d");
            context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, 10);
            context.fillRect(0, 0, 10, canvas.height);
            context.fillRect(0, canvas.height - 10, canvas.width, 10);
            context.fillRect(canvas.width - 10, 0, 10, canvas.height);
            this.setState({ greenBorder: true });
        }
    };

    setUpFecRec = () => {
        console.log("started");
        FaceRec.init()
            .then(res => {
                console.log(res);
                this.setState({
                    loading: false,
                    faceapi: res.faceapi,
                    faceMatcher: res.faceMatcher
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    startScan = () => {
        var scanner = setInterval(() => {
            if (this.state.faceapi) {
                var input = document.getElementsByTagName("video")[0];
                var canvas = document.getElementById("overlay");

                const displaySize = {
                    width: input.videoWidth,
                    height: input.videoHeight
                };
                this.state.faceapi.matchDimensions(canvas, displaySize);
                this.setState({
                    canvas: canvas,
                    input: input,
                    initializedCanvas: true
                });

                this.state.faceapi
                    .detectSingleFace(this.state.input)
                    .withFaceLandmarks()
                    .withFaceDescriptor()
                    .then(res => {
                        if (res) {
                            const result = this.state.faceMatcher.findBestMatch(
                                res.descriptor
                            );

                            if (this.state.scannedPercent < 100) {
                                this.setState((prevState, props) => {
                                    return {
                                        scannedPercent:
                                            prevState.scannedPercent +
                                            100 / this.state.scanTime
                                    };
                                });

                                this.setState((prevState, props) => {
                                    var currScan = prevState.currScan;
                                    currScan[result["_label"]] += 1;
                                    var currTop = prevState.currTop;
                                    var currFace = prevState.currFace;
                                    if (currScan[result["_label"]] > currTop) {
                                        currTop = currScan[result["_label"]];
                                        currFace = result["_label"];
                                    }
                                    return { currTop, currFace, currScan };
                                });
                            } else {
                                if (this.state.currFace == "unknown") {
                                    this.desicionUI("#FF0000");
                                    var resetScan = {
                                        Naseer: 0,

                                        Mannan: 0,
                                        Aditi: 0,
                                        Jannat: 0,
                                        Puneet: 0,
                                        unknown: 0,
                                        Mannan: 0,
                                        Kenneth: 0
                                    };
                                    this.setState({
                                        scannedPercent: 0,
                                        faceLabel: null,
                                        currTop: 0,
                                        currScan: resetScan
                                    });
                                } else {
                                    this.setState((prevState, props) => {
                                        this.desicionUI("#7CFC00");
                                        var currFace = prevState.currFace;
                                        if (currFace == result["_label"]) {
                                            fetch(
                                                this.state.url +
                                                    "/mark_attendance/" +
                                                    currFace
                                            );
                                            return { faceLabel: currFace };
                                        } else {
                                            var resetScan = {
                                                Naseer: 0,

                                                Mannan: 0,
                                                Aditi: 0,
                                                Jannat: 0,
                                                Puneet: 0,
                                                unknown: 0,
                                                Mannan: 0,
                                                Kenneth: 0
                                            };
                                            return {
                                                scannedPercent: 0,
                                                faceLabel: null,
                                                currTop: 0,
                                                currScan: resetScan
                                            };
                                        }
                                    });
                                }
                            }
                            const box = res.detection.box;
                            if (this.state.faceLabel != null) {
                                const drawBox = new this.state.faceapi.draw.DrawBox(
                                    box,
                                    {
                                        label:
                                            this.state.faceLabel +
                                            " (" +
                                            this.state.matricNumbers[
                                                this.state.faceLabel
                                            ] +
                                            ")"
                                    }
                                );
                                drawBox.draw(this.state.canvas);
                            } else {
                                const drawBox = new this.state.faceapi.draw.DrawBox(
                                    box,
                                    {
                                        label: this.state.faceLabel
                                    }
                                );
                                drawBox.draw(this.state.canvas);
                            }
                        } else {
                            var resetScan = {
                                Naseer: 0,
                                Aditi: 0,
                                Jannat: 0,
                                Puneet: 0,
                                unknown: 0,
                                Mannan: 0,
                                Kenneth: 0
                            };
                            this.setState({
                                scannedPercent: 0,
                                faceLabel: null,
                                currTop: 0,
                                currScan: resetScan
                            });
                            console.log("No faces detected");
                        }
                    });
            }
        }, 1000);

        return scanner;
    };

    setupVideoElement = () => {
        var videoInterval = setInterval(() => {
            var input = document.getElementsByTagName("video")[0];

            console.log(input);
            if (input) {
                console.log(input.videoHeight);
                console.log(input.videoWidth);
            }
        }, 1000);
    };

    render() {
        const { currentUser } = this.state;
        return (
            <React.Fragment>
                {this.state.webcamEnabled ? (
                    this.state.loading ? (
                        <div className="parent">
                            <Row className="justify-content-center vAlign">
                                <Spinner animation="border" />
                            </Row>
                        </div>
                    ) : (
                        <div>
                            <canvas
                                id="overlay"
                                style={{
                                    height: "480px",
                                    width: "640px",
                                    position: "absolute",
                                    zIndex: 3,
                                    top: "10%",
                                    right: "-6%"
                                }}
                            ></canvas>
                            <div className="parent">
                                <Row className="justify-content-center vAlign">
                                    <Webcam style={{ margin: "20px" }} />
                                    <Container>
                                        <ProgressBar
                                            animated
                                            now={this.state.scannedPercent}
                                            style={{ margin: "20px" }}
                                        />
                                    </Container>

                                    <Button
                                        variant="outline-primary"
                                        onClick={this.cancel}
                                        style={{
                                            margin: "20px"
                                        }}
                                    >
                                        End Session
                                    </Button>
                                </Row>
                            </div>
                        </div>
                    )
                ) : (
                    <>
                        <Container fluid md={12}>
                            <Col
                                md={{ span: 6, offset: 3 }}
                                style={{ bottom: "20px" }}
                            >
                                <Image
                                    src={currentUser.profileUrl}
                                    roundedCircle
                                    alt="profile"
                                    style={{
                                        marginBottom: "30px",
                                        marginTop: "70px"
                                    }}
                                />
                            </Col>
                        </Container>
                        <Jumbotron>
                            <Container>
                                <h1
                                    style={{
                                        fontFamily: "Helvetica",
                                        textAlign: "center"
                                    }}
                                    className="text-center"
                                >
                                    Welcome, <br />
                                    <strong>
                                        {currentUser.firstName}
                                    </strong>
                                </h1>
                            </Container>
                        </Jumbotron>
                        <Col>
                            <p
                                style={{
                                    fontFamily: "Helvetica",
                                    textAlign: "center",
                                    fontSize: "25px"
                                }}
                            >
                                Your role is:{" "}
                                <strong>{currentUser.role}</strong>
                                <br />
                            </p>
                            <p
                                style={{
                                    fontFamily: "Helvetica",
                                    textAlign: "center",
                                    fontSize: "16px"
                                }}
                            >
                                Network Id:{" "}
                                <strong>{currentUser.networkId}</strong>
                                <br />
                            </p>
                        </Col>
                        {currentUser.role === Role.Professor && (
                            <Row className="justify-content-center mt-5">
                                <Button
                                    variant="warning"
                                    onClick={this.enableWebcam}
                                >
                                    Start Session
                                </Button>
                            </Row>
                        )}
                    </>
                )}
            </React.Fragment>
        );
    }
}

export default HomePage;
