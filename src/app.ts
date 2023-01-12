import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";
import tactJs, { PositionType } from "tact-js";

class App {

    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        new SpeechSynthesisUtterance();

        document.onload = () => {
            console.log("document loaded");
            this.speech();
        }

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

        window.addEventListener("resize", () => {
            engine.resize();
        });

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
            if (ev.keyCode === 32) {
                this.hit();
            }
            if (ev.key === 's') {
                this.speech();
            }
        });

        if (!tactJs) {
            console.log('tact is not supported');
            return;
        }

        // Enable tactJs
        console.log("starting tactJs");
        tactJs.turnOffAll();

        tactJs.addListener(function (msg) {
            if (msg.status === 'Connected') {
                console.log('tact is connected');
                this.hit();
            } else if (msg.status === 'Disconnected') {
                console.log('tact is disconnected');
            } else if (msg.status === 'Connecting') {
                console.log('tact is connecting');
            }
            else if (msg.status === 'Error') {
                console.log('tact error: ' + msg);
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    hit() {
        console.log('hit');
        // TODO: remove this - just testing

        var key = 'dot';
        var position = PositionType.VestFront;
        var points = [{
            index: 10,
            intensity: 100
        }];
        var durationMillis = 1000; // 1000ms
        var errorCode = tactJs.submitDot(key, position, points, durationMillis);
        if (errorCode !== 0) {
            console.log('tact error: ' + errorCode);
        }

    }

    speech() {
        console.log('speech');
        if ('speechSynthesis' in window) {
            // speechSynthesis.speak(new SpeechSynthesisUtterance('Hello World'));
            console.log("speechSynthesis supported")
            var msg = new SpeechSynthesisUtterance();
            var voices = speechSynthesis.getVoices();
            if (voices.length > 0)
            {
                msg.voice = voices[5]; 
            // console.log(voices)
            //msg.volume = 1; // From 0 to 1
            //msg.rate = 1; // From 0.1 to 10
            //msg.pitch = 2; // From 0 to 2
                msg.text = "Good morning, Dave. I'm sorry I can't do that.";
                msg.lang = 'en';
                speechSynthesis.speak(msg);
            }
        } else {
            // Speech Synthesis Not Supported
            console.log("Sorry, your browser doesn't support text to speech!");
        }
    }
}
new App();