---
title: "Doing Things!"
date: 2023-08-09
permalink: /posts/second-post/
image: "https://picsum.photos/id/243/200/200"
tags:
  - cool posts
  - life
  - programming
  - Arduino
categories:
  - Programming
---

So far this summer, I've been looking at a bunch of things on my to-do list. Among them are looking for colleges to apply to, thinking about things to write about, and learning new things. More importantly, I've thought a bit about the future and realized that I might not have enough time to make all the projects I want to.

## Project Ideas

Here are a bunch of the ideas that I began coding but haven't finished yet. I'm not sure if I'll ever finish them, but I hope I do. I think they're pretty cool.

- Parody Lyric Generator
  - This has already been done, but I think I can do it better
- FRC Charged Up Game Simulation
  - I want to build a simulation to get some practice with the algorithms that I will use on our real robot.
  - I also want to train a neural network to play the game. I think it would be cool to see how well it does.
- [Digits](https://engaging-data.com/digitsgame/) Solver
  - I'm not sure what the name of this game is, but it has 9 cards with different numbers. You need to make an expression with some of the cards to equal one of the numbers on the grid. I feel like making a solver for this game would be interesting, especially optimizing it.
- AR Library
  - This is a project I am working on with a friend to make an AR viewer for any PDF online. I've never made an AR app before, so I think it would be a good learning experience.
- Smart Robot Car
  - In the back of my mind, I also want to make a car with a camera which basically serves as a mobile Alexa. I know this will be hard, but it's a cool idea.

## Life

Nothing much has really happened recently. I've tried juggling all the things I have to do as best I can.
Kinda unrelated, but I hit my first boundary in a cricket game last Saturday! I was also not out! So I did my job superbly.

I'm not sure what this blog is gonna turn into. It doesn't take very long to blog, but I just need to remember to stick with it.

## Random Arduino Stuff

So the other day I got some [ESP8266s](https://www.google.com/search?q=esp8266&oq=esp8266&aqs=chrome..69i61j69i57j69i59l3j69i60l3.3779j0j7&sourceid=chrome&ie=UTF-8) and honestly these things are better than the Arduino Uno. They're smaller, cheaper, and have wifi. Now that I have them, I've fallen in love with them. Since I have 3 of them, I can also make more projects without having to reuse them now.

### Lighting an LED but with a twist

My first project, as I do with any new board, was to light an LED. Once I had the basic code working, I decided to use the Wifi capability of my new toy, I mean board. With the help of ChatGPT, I made a simple website to control the state of the LED, which worked surprisingly well.

Here's the code

```cpp
// import modules
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

#define STASSID "Wouldn't you like to know"
#define STAPSK "a good thing I'm not using my real password"

const int ledPin = D2;

ESP8266WebServer server(80);

// the webpage
void handleRoot() {
  String html = "<html><body>";
  html += "<h1>Control LED</h1>";
  html += "<p>Click the button to toggle the LED:</p>";
  html += "<form action='/toggle' method='POST'><input type='submit' value='Toggle LED'></form>";
  html += "LED is now " + String(digitalRead(ledPin) ? "ON" : "OFF");
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// handle toggle request
void handleToggle() {
  static bool ledState = false;
  ledState = !ledState;
  digitalWrite(ledPin, ledState ? HIGH : LOW);
  handleRoot();
}

void setup() {
  // configure LED
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  Serial.begin(115200);

  // connect to wifi
  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    // keep trying to connect if not connected
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("WiFi connected");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());

  // configure server
  server.on("/", handleRoot);
  server.on("/toggle", HTTP_POST, handleToggle);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

### Making a Clock
Along with the microcontrollers, I also get a nice LED array. So I decided to make a clock to test it out. I also used a buzzer to serve as an alarm. I built a clock using my Arduino and a real time clock module before but it was a pain to set up and didn't look as nice as the LED array.

Here's the code

```cpp
// Including the required Arduino libraries
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <string>

#include <NTPClient.h>  // Include NTPClient library
#include <TimeLib.h>

// Uncomment according to your hardware type
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW
//#define HARDWARE_TYPE MD_MAX72XX::GENERIC_HW

// Defining size, and output pins
#define MAX_DEVICES 4
#define CS_PIN D8

const char *ssid = "Im not careless";
const char *password = "hi";

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "time.nist.gov", 3600, 60000);
char Time[] = "00:00";
char Date[] = "00/00";
/* int month_codes[] = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
 */ // I was playing around with using something to calculate the day of the week, but I didn't end up using it
byte last_second, second_, minute_, hour_, day_, month_;
int year_;

bool sec = false;

// Create a new instance of the MD_Parola class with hardware SPI connection
MD_Parola myDisplay = MD_Parola(HARDWARE_TYPE, CS_PIN, MAX_DEVICES);

void setup() {
  pinMode(D0, OUTPUT);
  Serial.begin(9600);
  // Intialize the object
  myDisplay.begin();

  // Set the intensity (brightness) of the display (0-15)
  myDisplay.setIntensity(0);

  // Clear the display
  myDisplay.displayClear();
  myDisplay.setTextAlignment(PA_CENTER);
  myDisplay.print("Booting...");
  // myDisplay.displayScroll("Friday August 3, 2023. 8:37 pm :)", PA_CENTER, PA_SCROLL_LEFT, 50);
  WiFi.begin(ssid, password);

  Serial.print("Connecting.");
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(D0, HIGH);
    delay(450);
    Serial.print(".");
    digitalWrite(D0, LOW);
    delay(50);
  }
  Serial.println("connected");
  myDisplay.setTextAlignment(PA_CENTER);
  myDisplay.print("Start...");
  timeClient.begin();
}

void loop() {
  /* if (myDisplay.displayAnimate()) {
    myDisplay.displayScroll("Get out of bed loser!! <o _ o> ", PA_CENTER, PA_SCROLL_LEFT, 30);
		myDisplay.displayReset();
	} */ // testing out valid emoticons lol
  timeClient.update();
  unsigned long unix_epoch = timeClient.getEpochTime();  // Get Unix epoch time from the NTP server

  second_ = second(unix_epoch);
  if (last_second != second_) {
    minute_ = minute(unix_epoch);
    // fix the hour
    if (hour(unix_epoch) - 5 < 0) {
      hour_ = (hour(unix_epoch) + 7) % 12;
    } else {
      hour_ = (hour(unix_epoch) - 5) % 12;
    }

    day_ = day(unix_epoch);
    month_ = month(unix_epoch);
    year_ = year(unix_epoch);

    // dont want hour 0
    if (hour_ == 0) {
      hour_ = 12;
    }

    int hour_num = (hour(unix_epoch) + 19) % 24;
    // make it brighter at specific times
    if ((hour_num >= 8 && hour_num <= 10) || (hour_num >= 17 && hour_num <= 21)) {
      myDisplay.setIntensity(5);
    } else {
      myDisplay.setIntensity(0);
    }

    Serial.println(hour_num);

    // alarms
    if (hour_num == 12 && minute_ == 57) {
      digitalWrite(D0, sec);
    } else if (hour_num == 8 && minute_ == 0) {
      digitalWrite(D0, sec);
    } else if (hour_num == 8 && minute_ == 5) {
      digitalWrite(D0, sec);
    } else {
      digitalWrite(D0, LOW);
    }

    // Time[7] = second_ % 10 + 48;
    // Time[6] = second_ / 10 + 48;
    Time[4] = minute_ % 10 + 48;
    Time[3] = minute_ / 10 + 48;
    Time[2] = sec ? ':' : ' ';
    Time[1] = hour_ % 10 + 48;
    Time[0] = hour_ / 10 + 48;


    // Display time and date on the 16x2 LCD
    myDisplay.setTextAlignment(PA_CENTER);
    myDisplay.displayClear();
    if (Time[0] == '0') {
        // I don't like it with the leading 0, so I made a new array to store the time without it
      char timeSlice[] = "0:00";

      // Copy the characters from the Time array to the new array
      for (int i = 0; i < 4; i++) {
        timeSlice[i] = Time[i + 1];  // Start from index 1 in Time array and copy to timeSlice
      }
      Serial.println(timeSlice);
      myDisplay.print(timeSlice);
    } else {
      myDisplay.print(Time);
    }

    /* year_code = (year_ % 100 + year / 4) % 7;
    byte day_of_week = (year_code + month_code + century_code + date_num - leap_year) % 7; */
    sec = !sec;
    last_second = second_;
  }

  delay(200);
  // testing

  // myDisplay.setTextAlignment(PA_LEFT);
  // myDisplay.print("Left");
  // delay(2000);

  /*myDisplay.setTextAlignment(PA_CENTER);
	myDisplay.print("Archu");
	delay(2000); */

  // myDisplay.setTextAlignment(PA_RIGHT);
  // myDisplay.print("Right");
  // delay(2000);

  // myDisplay.setTextAlignment(PA_CENTER);
  // myDisplay.setInvert(true);
  // myDisplay.print("Invert");
  // delay(2000);

  // myDisplay.setInvert(false);
  // myDisplay.print(1234);
  // delay(2000);
}
```

### Creating a better Roku Remote
Another project I've wanted to make was a better version of a Roku remote. I thought that using a joystick instead of a keypad would be a better way to control it (turns out it probably wasn't a good idea). Before, I used an Arduino connected to my PC with pyFirmata to read the joystick and use the laptop's Wifi to control the Roku, but that was pretty janky and wasn't as mobile as I wanted. With the ESP8266, I had a Wifi connection on board! 

However, the one drawback of the ESP8266 was that it only had one analog pin and my joystick needed 2, one for x and one for y. After some searching, I found the solution: multiplexing! All I needed was an integrated circuit that would take multiple analog inputs, and using digital inputs given to it from the microcontroller, send out a single signal with the requested pin. I spent 30 minutes wiring up the circuit based on a tutorial I found, but it didn't work. It turns out I had a motor integrated circuit.🤦How was I supposed to know that I needed a multiplexing integrated circuit?!?! They all look the same! Thankfully, I found another tutorial with someone doing the same thing as me with perhaps a jankier solution. [His solution](https://hackaday.io/project/8435-2-analog-inputs-for-esp8266-without-multiplexer) was to take the analog signals, connect them to a digital pin, and set the pins to low whenever the other pin was requested. I thought this would set my circuit on fire, but it ended up working fine. I thought it was a smart solution to the problem.

Once I had everything wired, programming was relatively straightforward. After breaking my TV for a couple of minutes by using `keyDown` instead of `keyPress`, I was on my way. After using the joystick for a couple of minutes, I soon discovered why TVs don't generally use joysticks: they're impossible to control! When I wanted to transition from going to the right to the left, sometimes it would trigger the up button. This could be corrected by changing the threshold for activation, but I think this problem would have persisted regardless. I didn't have a physical case for the remote, so maybe I could have used physical limits. I feel like with some good engineering and a lot of testing, a joystick could be a good alternative to a keypad, but I don't think I'll be doing that anytime soon. I kinda gave up on the project after that.

Here's the code for the project:
```c++
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#define X_PIN D1
#define Y_PIN D2

char ssid[] = "You-thought";
char pass[] = "no-way-jose";

String roku = "192.168.1.162";

HTTPClient http;

bool isRightButtonDown = false;
bool isLeftButtonDown = false;
bool isUpButtonDown = false;
bool isDownButtonDown = false;
bool isSelectButtonDown = false;

void setup() {
  //Deifne output pins for Mux
  pinMode(A0, INPUT);
  pinMode(D3, INPUT);
  Serial.begin(9600);

    /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
     would try to act as both a client and an access-point and could cause
     network-issues with your other WiFi-devices on your WiFi-network. */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

}

void buttonPress(String button) {
  digitalWrite(D0, HIGH);
  WiFiClient client;
  Serial.println("Sending command " + button);
  
  String url = "http://" + roku + ":8060/" + button;
  http.begin(client, url);
  http.POST("");
  http.end();
  digitalWrite(D0, LOW);
}


void buttonKeyDown(String button) {
  if (button == "right" && !isRightButtonDown) {
    buttonPress("keydown/right");
    isRightButtonDown = true;
  } else if (button == "left" && !isLeftButtonDown) {
    buttonPress("keydown/left");
    isLeftButtonDown = true;
  } else if (button == "up" && !isUpButtonDown) {
    buttonPress("keydown/up");
    isUpButtonDown = true;
  } else if (button == "down" && !isDownButtonDown) {
    buttonPress("keydown/down");
    isDownButtonDown = true;
  } else if (button == "select" && !isSelectButtonDown) {
    isSelectButtonDown = true;
  }
}

void buttonKeyUp(String button) {
  if (button == "right" && isRightButtonDown) {
    buttonPress("keyup/right");
    isRightButtonDown = false;
  } else if (button == "left" && isLeftButtonDown) {
    buttonPress("keyup/left");
    isLeftButtonDown = false;
  } else if (button == "up" && isUpButtonDown) {
    buttonPress("keyup/up");
    isUpButtonDown = false;
  } else if (button == "down" && isDownButtonDown) {
    buttonPress("keyup/down");
    isDownButtonDown = false;
  } else if (button == "select" && isSelectButtonDown) {
    buttonPress("keypress/select");
    isSelectButtonDown = false;
  }
}

float getX() {
  pinMode(X_PIN, INPUT);
  pinMode(Y_PIN, OUTPUT);
  digitalWrite(Y_PIN, LOW);
  delay(1);
  return analogRead(A0);
}

float getY() {
  pinMode(Y_PIN, INPUT);
  pinMode(X_PIN, OUTPUT);
  digitalWrite(X_PIN, LOW);
  delay(1);
  return analogRead(A0);
}

void handleJoystick() {
  float x = getX();
  float y = getY();

  // Check for corners
  if (x < 20 && y < 20) {
    // buttonPress("keypress/instantreplay");
    return;
  } else if (x > 350 && y < 20) {
    // buttonPress("keypress/info");
    return;
  } else if (x < 20 && y > 350) {
    // buttonPress("keypress/back");
    return;
  } else if (x > 350 && y > 350) {
    // buttonPress("keypress/home");
    return;
  }

  if (x > 340) {
    buttonKeyDown("right");
  } else if (x < 60) {
    buttonKeyDown("left");
  } else {
    buttonKeyUp("right");
    buttonKeyUp("left");
  }

  if (y > 340) {
    buttonKeyDown("up");
  } else if (y < 60) {
    buttonKeyDown("down");
  } else {
    buttonKeyUp("up");
    buttonKeyUp("down");
  }

  if (digitalRead(D3) == LOW) {
    buttonKeyDown("select");
  } else {
    buttonKeyUp("select");
  }

  return;
}

void loop() {
  handleJoystick();
  delay(20);
}
```

## Conclusion
Overall, these projects have been nice. I learned a lot about the ESP8266 and how to use it. I also learned a lot about how to use the Arduino IDE. I think I could have done a better job with the joystick, but I think I'll leave that for another day. I'm happy with these projects and look forward to making more in the future!

Also, the reason that I have the code here is because I thought that they weren't big enough projects to warrant their own repositories. I also didn't want to make a repository for each project because I didn't want to clutter my GitHub. I still wanted to remember these projects, so I decided to put them here.