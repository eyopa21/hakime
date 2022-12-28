<template>
    <div>
        homepage
        <div>
            <button @click="logoutt()">logout</button>
            {{isAuthenticated}}
        </div>
    </div>
</template>
<script setup>
import { createAuth0, useAuth0 } from '@auth0/auth0-vue';
const { isLoading, isAuthenticated, logout, getAccessTokenSilently } = useAuth0();

const logoutt = () => {
logout();
}
</script>