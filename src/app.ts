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

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var tactJsRunning = false;

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
                tactJsRunning = true;
            } else if (msg.status === 'Disconnected') {
                console.log('tact is disconnected');
                tactJsRunning = false;
            } else if (msg.status === 'Connecting') {
                console.log('tact is connecting');
            }
            else if (msg.status === 'Error') {
                console.log('tact error: ' + msg);
            }
        });

        // TODO: remove this - just testing
        if (tactJsRunning) {
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

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();