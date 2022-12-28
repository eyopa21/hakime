import { defineNuxtPlugin } from "#app";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { setContext } from "@apollo/client/link/context";


import { createAuth0, useAuth0 } from '@auth0/auth0-vue';



export default defineNuxtPlugin((nuxtApp) => {
    //const { getAccessTokenSilently, isLoading, isAuthenticated, loginWithRedirect, idTokenClaims } = useAuth0();


    const authDomain = "eyoba.us.auth0.com"
    const auth0ClientId = "VxkD0WpJu7S4CdjguUq66MqY8hh1HDB0"
    const auth0Audience = "example-blog"

    const authLink = setContext((_, { headers }) => {
        /*
        if (process.client) {
            const token = localStorage.getItem('token')
        

            if (token) {


                return {
                    headers: {
                        ...headers,
                        //"x-hasura-admin-secret": 'vQ28vOPti6QW71sJSTzsPai6uzEmPv7mYolvxYB7bPzQHNzycbsrZN3IfxtfUOGV',
                        Authorization: token ? `Bearer ${token}` : "",
                        // Authorization: "token",
                    },
                };
            }


        }

*/
    });
    const httpLink = createHttpLink({
        uri: "http://localhost:8080/v1/graphql",
    });

    const apolloClient = new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
    });
    nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient);


});