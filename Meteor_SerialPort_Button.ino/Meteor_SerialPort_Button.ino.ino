const int buttonPin = 2;     // the number of the pushbutton pin
const int ledPin = 13;       // number of LED pin
const int lightOff = 0x00;
const int lightOn = 0x01;
const int lightState = 0x02;

int buttonState = 0;         // variable for reading the pushbutton status
int incomingByte = lightOff; // variable for byte from server

void setup()
{
  pinMode(ledPin, OUTPUT);   // initialize the LED pin as an output
  Serial.begin(9600);
  pinMode(buttonPin, INPUT); // initialize the pushbutton pin as an input
}

void sendData() {
        Serial.print("\n{");
        Serial.print("\n\"pin\": ");
        Serial.print(buttonPin);
        Serial.print(",");
        Serial.print("\n\"state\":");
        //Serial.print(digitalRead(pin));
        Serial.print(digitalRead(buttonPin)); // send the button state;
        Serial.print(",");
        Serial.print("\n\"messageType\":\"buttonPress\"");
        //Serial.println("\n}");
}

void printFooter () {
  Serial.println("\n}");
}

void loop()
{
  if (Serial.available() > 0) {
    sendData();
    printFooter();
    digitalWrite(ledPin, digitalRead(buttonPin));
  }
  
  digitalWrite(ledPin, digitalRead(buttonPin)); // LED is on if the button is on, vice versa
}
