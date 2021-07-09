"use strict";
// Our input frames will come from here.
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const ringDirectory = [
    {
        "name": "Diamond",
        "image": "pics/2.png",
        "diameter": 280
    }
]
const canvasCtx = canvasElement.getContext('2d');
// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
const fpsControl = new FPS();
// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};

let beta = 0.45
let image = document.getElementById('2');

function saveOptions(options) {
    beta = options["size"]
    image = document.getElementById(options["ring"]);
}

function onResults(results) {
    // Hide the spinner.
    document.body.classList.add('loaded');
    // Update the frame rate.
    fpsControl.tick();
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks && results.multiHandedness) {
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const isRightHand = classification.label === 'Right';
            const landmarks = results.multiHandLandmarks[index];

            // drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: isRightHand ? '#00FF00' : '#FF0000' }),
            // drawLandmarks(canvasCtx, landmarks, {
            //     color: isRightHand ? '#00FF00' : '#FF0000',
            //     fillColor: isRightHand ? '#FF0000' : '#00FF00',
            //     radius: (x) => {
            //         return lerp(x.from.z, -0.15, .1, 10, 1);
            //     }
            // });

            // get landmarks and scale to canvas size
            let l13 = [landmarks[13]["x"], landmarks[13]["y"], landmarks[13]["z"]];
            let l14 = [landmarks[14]["x"], landmarks[14]["y"], landmarks[14]["z"]];
            const scaling_matrix = math.matrix([[canvasElement.width, 0, 0], [0, canvasElement.height, 0], [0, 0, canvasElement.width]])
            l13 = math.multiply(scaling_matrix, l13);
            l14 = math.multiply(scaling_matrix, l14);

            // get vector in direction of finger
            const v = math.subtract(l14, l13);

            // find central position
            const alpha = 0.35;
            const c = math.add(math.multiply(alpha, l13), math.multiply((1 - alpha), l14));

            // scale ring size
            const a = math.norm(v);
            const d = beta * a;
            const scale_factor = d / ringDirectory[0]["diameter"];
            const ring_dims = math.multiply(scale_factor, [image.width, image.height]); // width, height
            const offsets = math.multiply(0.5, ring_dims);

            // rotate ring
            const v_2d = v.subset(math.index([0, 1]));
            let theta = Math.acos(math.dot([0, -1], v_2d) / math.norm(v_2d));
            if (v_2d.subset(math.index(0)) < 0) {
                theta = -theta
            }
            canvasCtx.translate(c.subset(math.index(0)), c.subset(math.index(1)));
            canvasCtx.rotate(theta);
            canvasCtx.translate(-c.subset(math.index(0)), -c.subset(math.index(1)));

            // draw ring
            canvasCtx.drawImage(
                image,
                c.subset(math.index(0)) - offsets[0],
                c.subset(math.index(1)) - offsets[1],
                ring_dims[0],
                ring_dims[1]
            );

            canvasCtx.translate(c.subset(math.index(0)), c.subset(math.index(1)));
            canvasCtx.rotate(-theta);
            canvasCtx.translate(-c.subset(math.index(0)), -c.subset(math.index(1)));
        }
    }
    canvasCtx.restore();
}
const hands = new Hands({ locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
    } });
hands.onResults(onResults);
hands.setOptions({"selfieMode": true});
// Present a control panel through which the user can manipulate the solution
// options.
new ControlPanel(controlsElement, {
    // selfieMode: true,
    // maxNumHands: 2,
    // minDetectionConfidence: 0.5,
    // minTrackingConfidence: 0.5,
    ring: '2',
    size: 0.45
})
    .add([
    fpsControl,
    // new Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
    new SourcePicker({
        onSourceChanged: () => {
            hands.reset();
        },
        onFrame: async (input, size) => {
            const aspect = size.height / size.width;
            let width, height;
            if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
            }
            else {
                width = window.innerWidth;
                height = width * aspect;
            }
            canvasElement.width = width;
            canvasElement.height = height;
            await hands.send({ image: input });
        },
        examples: {
            videos: [],
            images: [],
        }
    }),
    // new Slider({
    //     title: 'Max Number of Hands',
    //     field: 'maxNumHands',
    //     range: [1, 4],
    //     step: 1
    // }),
    // new Slider({
    //     title: 'Min Detection Confidence',
    //     field: 'minDetectionConfidence',
    //     range: [0, 1],
    //     step: 0.01
    // }),
    // new Slider({
    //     title: 'Min Tracking Confidence',
    //     field: 'minTrackingConfidence',
    //     range: [0, 1],
    //     step: 0.01
    // }),
    new Slider({
        title: 'Size',
        field: 'size',
        range: [0.3, 0.6],
        step: 0.01
    }),
    new DropDownControl({
        title: 'Ring',
        field: 'ring',
        options: [
            {name: 'Diamond', value: '2'},
            {name: 'Sapphire', value: '3'}
        ],
    }),
])
    .on(x => {
    const options = x;
    videoElement.classList.toggle('selfie', options.selfieMode);
    // hands.setOptions(options);
    saveOptions(options);
});

