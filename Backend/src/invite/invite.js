const { request, gql, GraphQLClient } = require("graphql-request");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = new GraphQLClient("http://localhost:8082/v1/graphql");
const { sendEmail, test } = require('./sendEmail');

const HASURA_OPERATION = `
mutation($email: String!, $password: String!, $user_name: String!, $isSuperAdmin: Boolean) {
  insert_users_one(object: {email: $email, isSuperAdmin: $isSuperAdmin, password: $password, user_name: $user_name}) {
    id
  }
}
`;


const invite = async(req, res) => {
    const { email, user_name, isSuperAdmin } = req.body.input;

    let val = Math.floor(1000 + Math.random() * 900000000);
    console.log(val)

    const hashedPassword = await bcrypt.hash(val.toString(), 10);
    client
        .request(HASURA_OPERATION, { email, password: hashedPassword, user_name, isSuperAdmin })
        .then(async(data) => {


            // sendEmail(email, password);
            await test(email, val);
            return res.json({
                ...data.insert_users_one
            })
        }).catch(err => {
            console.log("errri", err)
            if (err.response) {

                return res.status(400).json({ message: err.response.errors[0].message });
            }
        })

}





module.exports = { invite }