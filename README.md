# intruder-detection

#### In this project a system was built to sense the presence of a person in a given location. It uses a motion sensor attached to a micro-controller (beaglebone black) to sense a person's persence and turns a light on in response. 

The applications of this sytem include an intruder detecter where an alarm is triggered in response to a person's uninvited presence in a location or an automated lighting system which turns on the lights when it senses a person's presence.

In addition to displaying real-time information about visitors using a web application through a browser, it also pushes sensor data to a database on Firebase. The functionality of the original system was extended by adding cloud functions which send email notifications to a user containing information about movement in the monitored area. The code for this added functionality is avaialble in the 'added-functionality' directory. 

### Uses:
Node.js
#### Frameworks & Libraries:
* Express.js
* Socket.IO
* jQuery
* Bootstrap
#### Cloud Platform:
Google Firebase

