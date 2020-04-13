const cron = require("node-cron");
const express = require("express");
var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// import file
const scrapper = require('./scrapper');

app = express();

const server = app.listen("8000");

// const SCHEDULING_INTERVAL = "0 */3 * * *"
const SCHEDULING_INTERVAL = "* * * * *"

// Email 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASS
    }
});

let mailOptions = {
    from: process.env.MY_EMAIL,
    to: process.env.SEND_TO_EMAIL,
    subject: 'Course Added',
    text: process.env.COURSE_CODE + ' was added to REM for you by a friendly bot! :)'
};

// schedule tasks to be run on the server every 3 hours
// Runs every three hours, turn * * * * * to test each minute
const job = cron.schedule(SCHEDULING_INTERVAL, function () {
    console.log("---------------------");
    console.log("Running Cron Job");
    console.log("---------------------");
    console.log("Logging in...");
    initAndLogin().then(() => {
        console.log("Adding courses...");
        coursePurifier(process.env.COURSE_CODE).forEach(course => {
            if (!(course.isAdded)) {
                operation(course.courseID).then(result => {
                    if (result !== "The course has not been added.") {
                        course.isAdded = true;
                        console.log("Courses Added");
                        // Send Email
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                // stop server
                                server.close(function () { console.log('Doh :('); });
                            } else {
                                console.log('Email sent: ' + info.response);
                                // stop server
                                job.stop()
                                server.close(function () { console.log('Doh :('); });
                            }
                        });
                    }
                    else {
                        console.log("Courses NOT Added :( \nill try again in 3h");
                    }
                }).catch(err => console.log(err))
            }
        })
    }).catch(err => console.log(err));
});


// Helper Functions
const coursePurifier = (courses) => {
    const coursesArray = courses.split(',')
    const map = []
    coursesArray.map(item => {
        map.push({
            courseID: item,
            isAdded: false
        })
    })
    return map
}

const initAndLogin = async () => {
    await scrapper.initialize();
    // Login 
    await scrapper.login(process.env.YORKU_PASSPORT_USERNAME, process.env.YORKU_PASSPORT_PASSWORD)

};

const operation = async (course) => {
    // Try to add this course
    return await scrapper.selectCourse(course);
}
