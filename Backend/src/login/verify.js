require("dotenv").config();
const { request, gql, GraphQLClient } = require("graphql-request");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = new GraphQLClient("http://localhost:8080/v1/graphql", {
    headers: {
        "x-hasura-admin-secret": "hakime",
    },
});


const verify = async(req, res) => {
    const QUERY = `  query MyQuery($id: Int!) {
        doctors_by_pk(id: $id) {
          code
        }
      }`;
    const HASURA_OPERATION = `
  
      mutation($id: Int!) {
        update_doctors_by_pk( pk_columns: {id: $id}, _set: {is_verified: true}) {
        is_verified
        id
        }
        }

`;
    const { id, code } = req.body.input;
    console.log("code", code)

    const doctor = await client.request(QUERY, { id });
    console.log("doc", doctor)


    if (code === doctor.doctors_by_pk.code) {
        console.log("good");
        client
            .request(HASURA_OPERATION, {
                id,
            })
            .then(async(data) => {
                console.log(data);
                if (data.update_doctors_by_pk) {
                    return res.json({
                        ...data.update_doctors_by_pk
                    });
                } else {
                    return res.status(400).json({ message: "some err" });
                }

            }).catch(err => {
                console.log("err", err)
                return res.status(400).json({ message: "some err" });

            })
    } else {
        console.log("wrong code");
        return res.status(400).json({ message: "wrong verification code" });
    }


};

module.exports = { verify };