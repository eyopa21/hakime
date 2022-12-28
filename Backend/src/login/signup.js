require("dotenv").config();
const axios = require('axios');
const { request, gql, GraphQLClient } = require("graphql-request");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = new GraphQLClient("http://localhost:8080/v1/graphql", {
    headers: {
        "x-hasura-admin-secret": "hakime",
    },
});

const signUp = async(req, res) => {
    const HASURA_OPERATION = `
    mutation ($fullName: String!, $sex: bpchar!, $phoneNumber: String!, $email: String!, $password: String!, $age: Int) {
      insert_users_one(object: {phone_number: $phoneNumber, sex: $sex, full_name: $fullName, email: $email, password: $password, age: $age}) {
        id
        full_name
        email
        password
        phone_number
        sex
        age
        created_at
        updated_at
        
        
      }
    }
    `;

    const { fullName, sex, phoneNumber, email, password, age } = req.body.input;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hased", hashedPassword);

    client
        .request(HASURA_OPERATION, {
            fullName,
            sex,
            phoneNumber,
            email,
            password: hashedPassword,
            age,
        })
        .then(async(data) => {
            console.log(data);

            if (data.insert_users_one) {
                const tokenContents = {
                    sub: "1234567890",
                    email: data.insert_users_one.email,
                    iat: 1516239022,
                    "https://hasura.io/jwt/claims": {
                        "x-hasura-allowed-roles": ["anonymous", "admin", "user"],
                        "x-hasura-default-role": "user",
                        "x-hasura-user-id": data.insert_users_one.id.toString(),
                    },
                };
                const token = jwt.sign(
                    tokenContents,
                    "1234567890123456789012345678901234567890"
                );

                return res.json({
                    ...data.insert_users_one,
                    token: token,
                });
            } else {
                return res.status(400).json({ message: "signup failed" });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({ message: "uniqueness violation" });
        });
};

const doctorSignUp = async(req, res) => {
    const HASURA_OPERATION = `
mutation($bio: String!, $current_hospital: String!, $email: String!, $experience: String!, $full_name: String!, $licence: String!, $password: String!, $phone_number: String!, $profile_picture: String!, $sex: bpchar!, $user_name: String!, $age: Int!, $code: String!) {
  insert_doctors_one(object: {bio: $bio, current_hospital: $current_hospital, email: $email, experience: $experience, full_name: $full_name, licence: $licence, password: $password, phone_number: $phone_number, profile_picture: $profile_picture, sex: $sex, user_name: $user_name, age: $age, code: $code}) {
    id
    email
  }
}
`;
    const {
        bio,
        current_hospital,
        email,
        experience,
        full_name,
        licence,
        password,
        phone_number,
        profile_picture,
        sex,
        user_name,
        age,
    } = req.body.input;
    const hashedPassword = await bcrypt.hash(password, 10);
    let code = Math.floor(1000 + Math.random() * 900000).toString();
    console.log("hased", hashedPassword);

    client
        .request(HASURA_OPERATION, {
            bio,
            sex,
            phone_number,
            email,
            password: hashedPassword,
            age,
            current_hospital,
            experience,
            full_name,
            licence,
            profile_picture,
            user_name,
            code
        })
        .then(async(data) => {
            console.log("email", data.insert_doctors_one.email);

            if (data.insert_doctors_one) {
                sendEmail(data.insert_doctors_one.email, code);

                const tokenContents = {
                    sub: "1234567890",
                    email: data.insert_doctors_one.email,
                    iat: 1516239022,
                    "https://hasura.io/jwt/claims": {
                        "x-hasura-allowed-roles": ["anonymous", "admin", "user"],
                        "x-hasura-default-role": "user",
                        "x-hasura-user-id": data.insert_doctors_one.id.toString(),
                    },
                };
                const token = jwt.sign(
                    tokenContents,
                    "1234567890123456789012345678901234567890"
                );

                return res.json({
                    ...data.insert_doctors_one,
                    token: token,
                });
            } else {
                return res.status(400).json({ message: "signup failed" });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({ message: "uniqueness violation" });
        });
};





const sendEmail = async(email, code) => {


    const options = {
        method: "POST",
        url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "ae5381ecc8msh0f57ec82fa1bea2p1bb060jsn95500a02d0b4",
            "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
        },
        data: `{"personalizations":[{"to":[{"email":"${email}"}],"subject":"Here is your invitation code"}],"from":{"email":"jobtennis21@gmail.com"},"content":[{"type":"text/plain","value":"your verification code is:${code}"}]}`,
    };

    axios
        .request(options)
        .then(async function(response) {
            console.log("You have successfully send your feedback!!!");
        })
        .catch((err) => {
            console.log("sending error", err);
        });
}
module.exports = { signUp, doctorSignUp };