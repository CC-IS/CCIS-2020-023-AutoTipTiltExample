//load the module for handling webcam input and recording
require('./src/camera.js');

//load the object that communicates with the arduino
var arduino = require('./src/controller.js').ArduinoController;

var app = {};

// shortened method for grabbing a element from the DOM
var getElm = query => {
  if(query.charAt(0) == '#') return document.querySelector(query);
  else return Array.from(document.querySelectorAll(query));
}

//function used to find the brightest spot on the screen
//in this case, the function is passed a single imageData object
// (https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
// and it is destructured here to the data, width, and height
// (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring)

var findBright = ({data,width, height})=>{
  var max = 0;  //stores the brightest average value found so far
  var ret = {x: 0, y: 0}; //stores the location of the brightest spot found
  for (var i = 0; i < height; i++) { // for each row,
    for (var j = 0; j < width; j++) { // iterate through each element in that row
      // (each pixel has RGBA data, 0 to 255, hence multiplying by 4), here we only average over RGB, not A, so divide by 3
      var avg = (data[i*(width*4) + j*4] + data[i*(width*4) + j*4 + 1] + data[i*(width*4) + j*4 + 2]) / 3
      if(avg > max){
        max = avg;
        ret.x = j;
        ret.y= i;
      }
    }
  }

  return ret;
}

// app.start is the function which is called once the DOM has been fully loaded, and we have access to all elements.
app.start = ()=>{
  // create a reference to the camera object
  var cam = getElm('cam-era')[0];

  // store our preferred video settings.
  var opts = {
    frameRate: 30,
    width: 1080,
    height: 1080
  }

  /// See here for options: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  cam.options.video = {
    width: {ideal: opts.width },
    height: {ideal: opts.height },
    frameRate: {ideal: opts.frameRate}
  };

  // start the camera feed
  // I don't get into how to record the video feed here, but can show you later.
  cam.startStream(()=>{
    //once the feed starts, do all this stuff:
    console.log('camera started');

    //create a reference to the html canvas object: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
    var canvas = getElm('#pixelData');
    var ctx = canvas.getContext('2d');

    //set the canvas size to the true video size
    canvas.width = cam.video.videoWidth;
    canvas.height = cam.video.videoHeight;

    //create an interval at the desired frameRate to capture new data
    setInterval(()=>{
      //draw the webcam video into the canvas
      ctx.drawImage(cam.video, 0,0, canvas.width, canvas.height);

      //grab the pixel data from the webcam
      var pixelData = ctx.getImageData(0 ,0, canvas.width, canvas.height);

      //process said data.
      var spot = findBright(pixelData);

      // use the results.
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'green';
      ctx.fill();
    }, 1000 / opts.frameRate);
  });

  // once the arduino connects and is ready,
  arduino.onReady = ()=>{
    //do stuff. In this case, blink the LED
    // See the controller.js file for more details
    let state = 0;
    setInterval(()=>{
      arduino.setPin(13,state);
      state = !state;
    }, 1000);
  }

  //start connecting to the arduino; you will likely need to change the manufacturer, this can be found using the windows device manager
  arduino.setup({manufacturer: 'Silicon Labs'});
}


//this is the code to launch the app.start once the DOM is loaded.
if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') app.start();
else document.addEventListener('DOMContentLoaded', function (event) {
  app.start();
});
