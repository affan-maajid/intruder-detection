const functions = require('firebase-functions');
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');

// Fetch the service account key JSON file contents
const serviceAccount = require("./serviceAccountKey.json");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp(//{
    //credential: admin.credential.cert(serviceAccount),
    //databaseURL: "https://fit3140.firebaseio.com"  // IMPORTANT: repalce the url with yours
//}
);


let objectArray = [];
let arrayPointer = 0;
let plusFive = 5;




    
    
    

exports.checkRange = functions.database.ref('/motionSensorData3/{pushId}').onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
    
        const original = snapshot.val();
        console.log(original);
        let t1 = 0;
        let t2 = 1500;
        let difference = original.motionEndTime - original.motionStartTime;
        let htmlTable = "<table border='2'><tr><th>Motion TimeStamp</th><th>Motion Start Time</th><th>Motion End Time</th>" +
        "<th>Motion Length</th></tr>";
        //console.log(difference);

        if(t1<difference && difference<t2) {
            emailMessage = 'Motion detected at timestamp: ' + original.timeStamp + ' lies between threshold.';
            console.log(emailMessage);
            //sendEmail();
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sender@gmail.com', //sender email
                    pass: 'password'		  // sender password
                }
            });

            htmlTable += "<tr><td>";
            htmlTable += original.timeStamp;
            htmlTable += "</td>";


            htmlTable += "<td>";
            htmlTable += original.motionStartTime;
            htmlTable += "</td>";



            htmlTable += "<td>";
            htmlTable += original.motionEndTime;
            htmlTable += "</td>";



            htmlTable += "<td>";
            htmlTable += difference;
            htmlTable += "</td></tr>";


            htmlTable += "</table>";





            let mailOptions = {
                from: 'sender@gmail.com',
                to: 'receiver@hotmail.com',
                subject: 'Motion Sensor Notification',
                text: 'Motion within the threshold detected',
                html: htmlTable

            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
    
        }

        return true;
    });




exports.exceedRange = functions.database.ref('/motionSensorData3/{pushId}').onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.

    const original = snapshot.val();
    //console.log(original);
    let t1 = 0;
    let t2 = 1500;
    let difference = original.motionEndTime - original.motionStartTime;
    //console.log(difference);

    if(difference>t2) {
        console.log('database reset');
        admin.database().ref("/motionSensorData3").remove();

    }


    return true;
});





exports.summary = functions.database.ref('/motionSensorData3/{pushId}').onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.

    const original = snapshot.val();
    //console.log(original);
    objectArray.push(original);
    //let tempArray = [];
    let htmlTable = "<h2>Summary of the last 5 new motions</h2><br>" +
        "<table border='2'><tr><th>Motion TimeStamp</th><th>Motion Start Time</th><th>Motion End Time</th>" +
        "</tr>";

    if (objectArray.length === plusFive) {
        for (let i = arrayPointer; i < objectArray.length; i++ ){
            //tempArray.push(objectArray[i]);

            htmlTable += "<tr><td>";
            htmlTable += objectArray[i].timeStamp;
            htmlTable += "</td>";


            htmlTable += "<td>";
            htmlTable += objectArray[i].motionStartTime;
            htmlTable += "</td>";



            htmlTable += "<td>";
            htmlTable += objectArray[i].motionEndTime;
            htmlTable += "</td></tr>";





        }
        htmlTable += "</table>";

        arrayPointer = plusFive;
        plusFive += 5;

        console.log('printing latest 5 messages');
        //console.log(tempArray);


        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                    user: 'sender@gmail.com', //sender email.
                    pass: 'password'		  // sender password
            }
        });





        let mailOptions = {
            from: 'sender@gmail.com',
            to: 'receiver@hotmail.com',
            subject: 'Summary latest 5 motions',
            text: 'Summary latest 5 motions',
            html: htmlTable

        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });



    }




    return true;
});