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
                naseer: 0,
                gujju: 0,
                abhinav: 0,
                aditi: 0,
                jannat: 0,
                puneet: 0,
                unknown: 0
            },
            currFace: null,
            faceLabel: null,
            currTop: 0
        };
    }

    enableWebcam = () => {
        this.setState({ webcamEnabled: true });
        if (!this.initializedModel) {
            this.setUpFecRec();
            this.initializedModel = true;
        }
        var scanner = this.startScan();
        // var scanner = "test";
        this.setState({ scanner });
    };

    cancel = () => {
        var scanner = this.state.scanner;
        clearInterval(scanner);
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
        // console.log(input)

        // this.setState({ canvas, input });
        var scanner = setInterval(() => {
            // console.log("running");
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

                // console.log(input);

                this.state.faceapi
                    .detectSingleFace(this.state.input)
                    .withFaceLandmarks()
                    .withFaceDescriptor()
                    .then(res => {
                        if (res) {
                            const result = this.state.faceMatcher.findBestMatch(
                                res.descriptor
                            );
                            // console.log("Recognized - ", result._label);
                            // console.log(result);
                            // const context = canvas.getContext("2d");
                            // context.clearRect(
                            //     10,
                            //     10,
                            //     canvas.width - 10,
                            //     canvas.height - 10
                            // );

                            // console.log(this.state.scannedPercent);

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
                                this.desicionUI("#7CFC00");
                                this.setState((prevState, props) => {
                                    var currFace = prevState.currFace;
                                    if (currFace == result["_label"]) {
                                        return { faceLabel: currFace };
                                    } else {
                                        var resetScan = {
                                            naseer: 0,
                                            gujju: 0,
                                            abhinav: 0,
                                            aditi: 0,
                                            jannat: 0,
                                            puneet: 0,
                                            unknown: 0
                                        };
                                        this.setState({
                                            scannedPercent: 0,
                                            faceLabel: null,
                                            currTop: 0,
                                            currScan: resetScan
                                        });
                                    }
                                });
                            }
                            // console.log(this.state.canvas);
                            const box = res.detection.box;
                            const drawBox = new this.state.faceapi.draw.DrawBox(
                                box,
                                { label: this.state.faceLabel }
                            );
                            drawBox.draw(this.state.canvas);
                        } else {
                            var resetScan = {
                                naseer: 0,
                                gujju: 0,
                                abhinav: 0,
                                aditi: 0,
                                jannat: 0,
                                puneet: 0,
                                unknown: 0
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

    // loader = () => {
    //     this.setUpFecRec();
    //     if (this.state.loading) {
    //         return (
    //             <Row className="justify-content-center">
    //                 <Spinner animation="border" />
    //             </Row>
    //         );
    //     } else {
    //         return (
    //             <Row className="justify-content-center">
    //                 <Webcam />
    //                 {this.setupVideoElement()}
    //             </Row>
    //         );
    //     }
    // };

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
                                {/* <Row
                                style={{ top: "100px" }}
                                className="justify-content-center"
                            ></Row> */}

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
                                        style={{ margin: "20px" }}
                                    >
                                        Cancel
                                    </Button>
                                </Row>
                            </div>
                        </div>
                    )
                ) : (
                    <>
                        <Container fluid md={12}>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Image
                                    src={currentUser.profileUrl}
                                    roundedCircle
                                    alt="profile"
                                    className="mt-5"
                                />
                            </Col>
                        </Container>
                        <Jumbotron>
                            <Container>
                                <h1 className="text-center">
                                    Welcome{" "}
                                    <strong>
                                        <i>{currentUser.firstName}</i>
                                    </strong>
                                </h1>
                            </Container>
                        </Jumbotron>
                        <Col>
                            <p>
                                Your role is:{" "}
                                <strong>{currentUser.role}</strong>
                            </p>
                        </Col>
                        {currentUser.role === Role.Professor && (
                            <Row className="justify-content-center mt-5">
                                <Button
                                    variant="warning"
                                    onClick={this.enableWebcam}
                                >
                                    Start my session
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
