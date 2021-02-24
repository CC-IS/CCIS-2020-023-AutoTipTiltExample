var {serialParser} = require('./serial/parser.js');

const READY = 1;
const SET_PIN = 2;
const BUTTON_PRESSED = 3;
const BROADCAST = 127;

class ArduinoController {
  constructor() {
    var _this = this;
    var parser = new serialParser();

    _this.config = {
    };

    parser.on(BUTTON_PRESSED, (data)=> {
      console.log(`Button ${data[0]} state is ${data[1]}`);
    });

    _this.onReady = ()=>{
      console.log('Controller Ready');
    };

    parser.on(READY, ()=> {
      if (!_this.ready) {
        _this.onReady();
        _this.ready = true;
      }
    });

    _this.setPin = (pin, state)=>{
      parser.sendPacket([1, SET_PIN, pin, state]);
    }

    _this.whenReady = (cb)=> {
      if (_this.ready) {
        cb();
      } else {
        this.on('ready', cb);
      }
    };

    parser.onOpen = ()=> {
      parser.sendPacket([BROADCAST, READY]);
    };

    _this.onPortNotFound = ()=>{};

    _this.portNotFound = false;

    parser.serial.onPortNotFound = ()=>{
      _this.portNotFound = true;
      _this.onPortNotFound();
    }

    _this.setup = (conf)=>{
      if (conf.path) parser.setup({ path: conf.path, baud: 115200 });
      else if (conf.manufacturer) parser.setup({ manufacturer: conf.manufacturer, baud: 115200 });
    }
  }

  set onready(cb) {
    //this.on_load = val;
    if (this.ready) {
      cb();
    } else {
      this.on('ready', cb);
    }
  }
};

exports.ArduinoController = new ArduinoController();
