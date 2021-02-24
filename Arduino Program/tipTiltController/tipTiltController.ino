#include "serialParse.h"
#include "timeOut.h"

// declare the terms for the parser commands
const int BUTTON_PRESSED = 3;
const int SET_PIN = 2;
const int READY = 1;

serialParser parser(Serial);



void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  parser.address = 1;

  pinMode(13, OUTPUT);

  for(int i=0; i<8; i++){
    pinMode(5,INPUT_PULLUP);
  }
  
  parser.on(READY, [](unsigned char * input, int size){
    parser.sendPacket(REPORT,READY);
  });

  parser.on(SET_PIN, [](unsigned char * input, int size){
    int pin = input[2];
    int state = input[3];

    digitalWrite(pin,state);
  });

  parser.sendPacket(REPORT,READY);
}

TimeOut debounceTimer;
int state = 1;

void loop() {
  parser.idle();

  if(digitalRead(5) != state){
    debounceTimer.set([](){
      state = !state;
      parser.sendPacket(REPORT, BUTTON_PRESSED, 5, state);
    }, 20);
  } else if(debounceTimer.running){
    debounceTimer.clear();
  }
}
