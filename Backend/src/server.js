const axios = require("axios");
const fetch = require("node-fetch")
const { request, gql, GraphQLClient } = require("graphql-request");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');


const { login } = require('./login/login')
const { signUp, doctorSignUp } = require('./login/signup')
const { invite, } = require('./invite/invite');
const { sendEmail, test } = require("./invite/sendEmail");
const { addImage } = require('./rooms/addImage');
const { verify } = require('./login/verify');






const client = new GraphQLClient("http://localhost:8080/v1/graphql", {
    headers: {
        "x-hasura-admin-secret": 'hakime',
    }
});









const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
    parameterLimit: 50000
}));










// Request Handler
app.post('/userSignUp', async(req, res) => {
    signUp(req, res);

});


app.post('/doctorsignup', async(req, res) => {
    doctorSignUp(req, res);
})









app.post("/login", async(req, res) => {
    login(req, res);
});
app.post('/invite', async(req, res) => {
    invite(req, res);
});


app.post('/addImage', async(req, res) => {
    addImage(req, res);


});

app.post('/verify', async(req, res) => {
    verify(req, res);
})

app.get('/testa', async(req, res) => {


    var messagebird = require('messagebird')('aTKw2CulVfEeGiQYpSWIzmCEK');

    var params = {
        'originator': 'TestMessage',
        'recipients': [
            '+251918784596'
        ],
        'body': 'This is a test message'
    };

    messagebird.messages.create(params, function(err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
})



app.listen(PORT, () => {
    console.log("app is running on server", PORT);
});