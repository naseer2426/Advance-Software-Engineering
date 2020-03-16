import React, { PureComponent } from "react";
import { ProgressBar, Row } from "react-bootstrap";

class Test extends PureComponent {
    constructor(props) {
        super(props);

        // this.state = {

        // }
    }

    render() {
        return <ProgressBar animated now={50}></ProgressBar>;
    }
}

export default Test;
