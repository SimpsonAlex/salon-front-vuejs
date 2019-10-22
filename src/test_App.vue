<template>
    <div id="app">
        <router-link v-if="this.$store.state.authenticated" :to="login" @click.native="logout()" >Logout</router-link>
        <router-view @authenticated="setAuthenticated" />
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                login: '/login',
            }
        },
        mounted() {
            if(!this.$store.state.authenticated && this.$router.currentRoute.path !== this.login) {
                this.$router.push(this.login);
            }
        },
        methods: {
            setAuthenticated(status) {
                this.$store.state.authenticated = status;
            },
            logout() {
                this.$store.state.token = ''
                this.$store.state.headerSimple = {}
                this.$store.state.headerFile = {}
                this.$store.state.authenticated = false;
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
