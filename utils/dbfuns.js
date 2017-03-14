const Sequelize = require('sequelize');
const encode = require('hashcode').hashCode();
const sequelize = new Sequelize("shorturl", "shorturl", "shorturl", {
    dialect: 'mysql',
    host: 'localhost'
});

//table to store mails in database
const mails = sequelize.define('mails', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    mail: {type: Sequelize.STRING, unique: true, validate: {isEmail: true}},
    isVerified: Sequelize.BOOLEAN,
    hash: Sequelize.STRING

})

//table for storing the urls
const tab = sequelize.define('shorturl', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    url: {type: Sequelize.STRING, unique: true, validate: {isUrl: true}},
    emailCheck: Sequelize.BOOLEAN,
    Shorturl: {type: Sequelize.STRING, unique: true, validate: {isUrl: true}}

});


sequelize.sync().then(() => {
});


//Function to add to mails
function addMail(mail, done) {
    mails.create({
        mail: mail,
        isVerified: false,
        hash: encode.value(mail)


    }).catch(function (err) {
        done(new Error("email already registered"))
    }).then(function () {
        done();
    })
}


//function to add to tab
function add(url, emailCheck, shorturl, done) {
    // console.log(url)
    tab.create({
        url: url,
        emailCheck: emailCheck,
        Shorturl: "http://localhost:4000/get/" + shorturl
    }).catch(function (err) {
        done(new Error("already exists"))

    }).then(function () {
        done();
    })
}


//function to get the shortened url
function get(short, shortcode, done) {
    tab.findOne({where: {Shorturl: short}}).then(function (row) {

        if (row.dataValues.emailCheck) {
            done('http://localhost:4000/AddMail?q=' + shortcode.substr(1));


        }
        else {

            done(row.dataValues.url);

        }


        // done(row.dataValues.url);
    })


}


//function to check if an email is already in database
function checkmail(email, shortcode, done1, done2, done3) {

    tab.findOne({where: {Shorturl: 'http://localhost:4000/get/' + shortcode}}).then(function (urlrow) {


        mails.findOne({where: {mail: email}}).then(function (row) {

            if (row) {
                if (row.isVerified) {
                    console.log(urlrow.url);
                    done1(urlrow.url);
                }
                else {
                    done2();
                }


            }
            else {
                done3();

            }


        })

    })


}


//function to verify the email adress -is executed when verification email is clicked
function verifyEmail(hash, done) {

    mails.findOne({where: {hash: hash}}).then(function (row) {
        row.update({
            isVerified: true
        })
        done();
    })


}


module.exports = {
    add, get, addMail, checkmail, verifyEmail


}
