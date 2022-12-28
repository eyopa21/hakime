require('dotenv').config()
const { request, gql, GraphQLClient } = require("graphql-request");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = new GraphQLClient("http://localhost:8080/v1/graphql", {
    headers: {
        "x-hasura-admin-secret": "hakime",
    },
});


const HASURA_OPERATION = `
query MyQuery($email: String!) {
  users(where: {email: {_eq: $email}}) {
    id
    email
    full_name
    phone_number
    sex
    password
    updated_at
    created_at
    appointments {
      id
      note
      price
      date
    }
  }

    doctors(where: {email: {_eq: $email}}) {
      email
      id
      full_name
      phone_number
      password
      updated_at
      created_at
      sex
      appointments {
        id
        note
        price
        date
      }
    }
}
`;


const login = async(req, res) => {
    const { email, password } = req.body.input;
    console.log("req", email, password);
    client
        .request(HASURA_OPERATION, { email })
        .then(async(data) => {
            console.log("data", data);
            if (data.users[0]) {
                const match = await bcrypt.compare(password, data.users[0].password);
                if (match) {

                    const tokenContents = {
                        sub: "1234567890",
                        email: data.users[0].email,
                        iat: 1516239022,
                        "https://hasura.io/jwt/claims": {
                            "x-hasura-allowed-roles": ["anonymous", "admin", "user"],
                            "x-hasura-default-role": "user",
                            "x-hasura-user-id": data.users[0].id.toString(),
                        },
                    };
                    const token = jwt.sign(
                        tokenContents, "1234567890123456789012345678901234567890"
                    );

                    return res.json({
                        ...data.users[0],
                        token: token,
                    });
                } else {
                    return res.status(400).json({ message: "password doesnt match" });
                }

            } else if (data.doctors[0]) {
                console.log("docotor found");
                const match = await bcrypt.compare(password, data.doctors[0].password);
                if (match) {

                    const tokenContents = {
                        sub: "1234567890",
                        email: data.doctors[0].email,
                        iat: 1516239022,
                        "https://hasura.io/jwt/claims": {
                            "x-hasura-allowed-roles": ["anonymous", "admin", "invited"],
                            "x-hasura-default-role": "super-admin",
                            "x-hasura-user-id": data.doctors[0].id.toString(),
                        },
                    };
                    const token = jwt.sign(
                        tokenContents, "1234567890123456789012345678901234567890"
                    );

                    return res.json({
                        ...data.doctors[0],
                        token: token,
                    });
                } else {
                    return res.status(400).json({ message: "password doesnt match" });
                }
            } else {
                return res.status(400).json({ message: "user not found" });
            }

        })
        .catch((err) => {
            console.log(err);
        });
};




module.exports = { login };