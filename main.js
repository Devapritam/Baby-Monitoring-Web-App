status = "";
objects = [];
alertSound = "";

function preload() {
    alertSound = loadSound("emergency_alert.mp3");
}

function setup() {
    canvas = createCanvas(450, 350);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(450, 350);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status - Detecting Object";
}

function modelLoaded() {
    window.alert("Cocossd model has been successfully loaded in  your application");
    status = true;
}

function gotResult(error, results) {
    if(error) {
        console.error(error);
    }
    else {
        console.log(results);
        objects = results;
    }
}

function draw() {
    image(video, 0, 0, 450, 350);
    
    if(status != "") {
        objectDetector.detect(video, gotResult);
        for(i = 0; i < objects.length; i++) {

            r = random(255);
            g = random(255);
            b = random(255);

            document.getElementById("status").innerHTML = "Status - Object Detected";

            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r, g, b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == "person") {
                document.getElementById("objectsDetected").innerHTML = "Baby Found";
                alertSound.stop();
            }
            
            else {
                document.getElementById("objectsDetected").innerHTML = "Baby Not Found";
                alertSound.play();
                setTimeout(() => {
                    alertSound.stop();
                }, 3000);
            }
        }

        if (objects.length <= 0) {
            document.getElementById("objectsDetected").innerHTML = "Baby Not Found";
            alertSound.play();
            setTimeout(() => {
                alertSound.stop();
            }, 3000);
        }

    }
}