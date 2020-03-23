// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
// import "@tensorflow/tfjs-node";
import * as faceapi from "face-api.js";
// import { initializers } from "@tensorflow/tfjs-node";
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function initialize() {
    // return "Testo geanisto";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(
        "http://localhost:8000/models"
    );
    await faceapi.loadFaceLandmarkModel("http://localhost:8000/models");
    await faceapi.loadFaceRecognitionModel("http://localhost:8000/models");

    const labels = ["naseer", "aditi", "jannat", "puneet", "mannan", "kenneth"];

    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
            // fetch image data from urls and convert blob to HTMLImage element
            const imgUrl = `http://localhost:8000/faces/${label}.jpg`;

            // if (label == "mannan") {
            //     const imgUrl = `http://localhost:8000/faces/${label}.jpeg`;
            // }
            const img = await faceapi.fetchImage(imgUrl);

            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
            const fullFaceDescription = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!fullFaceDescription) {
                throw new Error(`no faces detected for ${label}`);
            }

            const faceDescriptors = [fullFaceDescription.descriptor];
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
        })
    );

    const maxDescriptorDistance = 0.6;
    const faceMatcher = new faceapi.FaceMatcher(
        labeledFaceDescriptors,
        maxDescriptorDistance
    );
    // return "works lol";
    return { faceMatcher: faceMatcher, faceapi: faceapi };
}

export const FaceRec = {
    init: initialize
};
