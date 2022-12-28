const nodemailer = require("nodemailer");
const axios = require('axios');

const sendEmail = () => {
    var trasnsporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
            user: "jobnigussie21@gmail.com",
            pass: "0918784596",
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    var mailOptions = {
        from: "jobnigussie21gmail.com",
        to: "jobtennis21@gmail.com",
        subject: "from Sky resort owner",
        text: `here is your password change it and use it`,
    };

    trasnsporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("errrrrrrrrrrrrrrr", error);
            // return error;
        } else {
            console.log("email sent:" + info.response);
            // return "email sent:" + info.response;
        }
    });
};

const test = async(email, val) => {

    console.log(email, val);
    const options = {
        method: "POST",
        url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "ae5381ecc8msh0f57ec82fa1bea2p1bb060jsn95500a02d0b4",
            "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
        },
        data: `{"personalizations":[{"to":[{"email":"${email}"}],"subject":"Here is your invitation code"}],"from":{"email":"jobtennis21@gmail.com"},"content":[{"type":"text/plain","value":"your password is:${val}"}]}`,
    };

    axios
        .request(options)
        .then(async function(response) {
            console.log("You have successfully send your feedback!!!");
        })
        .catch((err) => {
            console.log("sending error", err);
        });
};

module.exports = { sendEmail, test };