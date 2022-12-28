<template>
    <div>
        login
        {{email}}
        <br>
        {{password}}
        <div>
            {{idTokenClaims}}
            
<input v-model="email" type="text">
<input v-model="password" type="text">
<button @click="login()">login</button>
    </div>
    </div>
</template>
<script setup>
import { createAuth0, useAuth0 } from '@auth0/auth0-vue';
const email = ref('')
const password = ref('')
const { isLoading, isAuthenticated, loginWithRedirect, idTokenClaims } = useAuth0();

const login = () => {
    console.log("login");
    loginWithRedirect();
}



</script>