const { request, gql, GraphQLClient } = require("graphql-request");

const fetch = require("node-fetch");
const imgbbUploader = require("imgbb-uploader");

const addImage = async(req, res) => {
    const client = new GraphQLClient("http://localhost:8082/v1/graphql", {
        headers: {
            "x-hasura-admin-secret": 123
        },
    });
    const { arg1 } = req.body.input;
    console.log(arg1.base64)

    const HASURA_OPERATION = `mutation ( $url: String!) {
    insert_images_one(object: { url: $url}) {
      id
    }
  }
  `;

    //const { image } = req.body;
    //console.log("reques", req);
    //console.log("head", req.headers.authorization);

    const options = {
        apiKey: "3ee76e94e5447686d6b70936ac389996",
        name: "yourCustomFilename",
        base64string: arg1.base64,
    };

    imgbbUploader(options)
        .then((response) => {
            console.log("res", response);
            console.log("url", response.display_url);

            client
                .request(
                    HASURA_OPERATION, { url: response.display_url })
                .then(async(data) => {
                    console.log("data", data);
                    return res.json({
                        url: response.display_url,
                        id: data.insert_images_one.id
                    });

                });
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = { addImage };