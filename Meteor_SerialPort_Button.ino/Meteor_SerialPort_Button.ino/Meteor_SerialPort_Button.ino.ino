const int buttonPin = 2;     // the number of the pushbutton pin
const int ledPin = 13;       // number of LED pin

int buttonState = 0;         // variable for storing the pushbutton status
int newButtonState = 0;      // variable for reading the pushbutton status

void setup() {               // this runs only once upon device start
  pinMode(ledPin, OUTPUT);   // initialize the LED pin as an output
  Serial.begin(9600);        // initialize Serial port
  pinMode(buttonPin, INPUT); // initialize the pushbutton pin as an input
  buttonState = digitalRead(buttonPin); // read button state the first time
}

void sendData() {            // crafts some JSON to send to the server
        Serial.print("\n{");
        Serial.print("\n\"pin\": ");
        Serial.print(buttonPin);
        Serial.print(",");
        Serial.print("\n\"state\":");
        Serial.print(digitalRead(buttonPin)); // send the button state;
        Serial.print(",");
        Serial.print("\n\"messageType\":\"buttonPress\"");
        Serial.println("\n}");
}

void loop() {                // this loops continuously while device is on  
  newButtonState = digitalRead(buttonPin); // read new Button state
  digitalWrite(ledPin, newButtonState);    // LED is on if the button is on, vice versa
 
  if (newButtonState == HIGH && buttonState == LOW && Serial.available() > 0) { 
    // if the button just got pressed AND the Serial connection is available
      sendData(); // send the button press to the server
  }
  
  buttonState = newButtonState;            // store the button state for comparison
}
