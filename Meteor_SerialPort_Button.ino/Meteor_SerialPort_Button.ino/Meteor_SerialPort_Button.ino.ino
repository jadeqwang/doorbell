const int buttonPin = 2;     // the number of the pushbutton pin
const int ledPin = 13;       // number of LED pin

int buttonState = 0;         // variable for reading the pushbutton status
int newButtonState = 0;      // variable for reading the pushbutton status

void setup()
{
  pinMode(ledPin, OUTPUT);   // initialize the LED pin as an output
  Serial.begin(9600);
  pinMode(buttonPin, INPUT); // initialize the pushbutton pin as an input
  buttonState = digitalRead(buttonPin);
}

void sendData() {
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

void printFooter () {
  Serial.println("\n}");
}

void loop()
{
  newButtonState = digitalRead(buttonPin); // read new Button state
  digitalWrite(ledPin, newButtonState);    // LED is on if the button is on, vice versa
 
  if (newButtonState == HIGH && buttonState == LOW) { // button just got pressed
    if (Serial.available() > 0) {
      sendData();
    }
  }
  
  buttonState = newButtonState;            // store the button state for comparison
}
