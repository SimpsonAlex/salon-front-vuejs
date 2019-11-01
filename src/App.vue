<template>
    <div id="app">
        <router-link v-if="authenticated" :to="login" @click.native="logout()">Logout</router-link>
        <router-view @authenticated="setAuthenticated"/>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                authenticated: localStorage.getItem('token'),
                login: '/login',
            }
        },
        created() {
            if (localStorage.getItem('token')) {
                this.$store.state.headerSimple = {
                    headers: {
                        "Authorization": 'Token ' + localStorage.getItem('token'),
                        "Content-Type": 'application/json', 'Accept': 'application/json'
                    }
                }
                this.$store.state.headerFile = {
                    headers: {
                        "Authorization": 'Token ' + localStorage.getItem('token'),
                        "Content-Type": 'multipart/form-data', 'Accept': 'application/json'
                    }
                }
            }
        },
        mounted() {
            if (!localStorage.getItem('token') && this.$router.currentRoute.path !== this.login) {
                this.$router.push(this.login);
            }
        },
        methods: {
            setAuthenticated(status) {
                this.$store.state.authenticated = status;
            },
            logout() {
                localStorage.setItem('token', '')
                this.$store.state.headerSimple = {}
                this.$store.state.headerFile = {}
                this.authenticated = false;
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
