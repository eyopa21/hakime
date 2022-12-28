import { defineNuxtPlugin } from "#app";


import { createAuth0, useAuth0 } from '@auth0/auth0-vue';



export default defineNuxtPlugin((nuxtApp) => {



    const authDomain = "eyoba.us.auth0.com"
    const auth0ClientId = "VxkD0WpJu7S4CdjguUq66MqY8hh1HDB0"
    const auth0Audience = "example-blog"

    nuxtApp.vueApp.use(
        createAuth0({
            domain: authDomain,
            client_id: auth0ClientId,
            redirect_uri: 'http://localhost:3000',
            cacheLocation: "localstorage",
            audience: auth0Audience
        })
    );

});