const express = require('express');
const app = express();
const bp = require('body-parser');
const nm = require('nodemailer');
const db = require('./utils/dbfuns');
const encode = require('hashcode').hashCode();


app.use(bp.json());
app.use(bp.urlencoded({extended: true}))
app.use('/', express.static(__dirname + '/public_html'));


let transporter = nm.createTransport({
    service: 'gmail',
    auth: {
        user: 'email-Id',
        pass: 'Password'
    }

});


app.listen(4000, function () {
    console.log("port 4000 is up")

});


app.post('/add', function (req, res) {

    var url = req.body.url;
    // console.log(url)
    var check = req.body.emailCheck;
    var shorturl = makeid();

    db.add(url, check, shorturl, function (err) {
        if (err) throw err
        res.send('http://localhost:4000/get/' + shorturl);
    })


})


app.use('/get', function (req, res) {
    shorturl = "http://localhost:4000/get" + req.url;
    // console.log(req.url)

    db.get(shorturl, req.url, function (data) {
        res.redirect(data);
    });
});


app.post('/AddMail', function (req, res) {
    var email = req.body.email;
    var shortcode = req.body.shortcode;
    console.log(shortcode)
    db.checkmail(email, shortcode, function (url) {
        res.send(url)

    }, function () {
        res.send('http://localhost:4000/PleaseVerify')

    }, function () {

        let mailsettings = {
            from: '"Varun Gupta" <varun.gupta1798@gmail.com>',
            to: email,
            subject: 'hello : test success',
            text: 'http://localhost:4000/verify/' + encode.value(email)

        };

        transporter.sendMail(mailsettings, (err, info) => {
            if (err) throw err;


        });
        db.addMail(email, function (err) {
            if (err) throw error

            res.send('http://localhost:4000/thanks');


        })

    })


})


app.use('/AddMail', express.static(__dirname + '/public_html/Mail'))
app.use('/verify', function (req, res) {
    db.verifyEmail(req.url.substr(1), function () {
        res.redirect('/verified');

    })


})


//Sample function -to be replaced by proper shortening logic
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//Todo replace the calls with localhost to actual urls








