require('./src/camera.js');
var arduino = require('./src/controller.js').ArduinoController;

var app = {};

var getElm = query => {
  if(query.charAt(0) == '#') return document.querySelector(query);
  else return Array.from(document.querySelectorAll(query));
}

var findBright = ({data,width, height})=>{
  var max = 0;
  var ret = {x: 0, y: 0};
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
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

app.start = ()=>{
  var cam = getElm('cam-era')[0];

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

  cam.startStream(()=>{
    console.log('camera started');

    var canvas = getElm('#pixelData');
    var ctx = canvas.getContext('2d');

    canvas.width = cam.video.videoWidth;
    canvas.height = cam.video.videoHeight;

    setInterval(()=>{
      ctx.drawImage(cam.video, 0,0, canvas.width, canvas.height);

      var pixelData = ctx.getImageData(0 ,0, canvas.width, canvas.height);

      var spot = findBright(pixelData);

      ctx.beginPath();
      ctx.arc(spot.x, spot.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'green';
      ctx.fill();
    }, 1000 / opts.frameRate);
  });

  arduino.onReady = ()=>{
    let state = 0;
    setInterval(()=>{
      arduino.setPin(13,state);
      state = !state;
    }, 1000);
  }

  arduino.setup({manufacturer: 'Silicon Labs'});
}

if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') app.start();
else document.addEventListener('DOMContentLoaded', function (event) {
  app.start();
});
