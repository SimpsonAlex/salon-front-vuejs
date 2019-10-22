<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="username" v-model="input.username" placeholder="Username">
        <input type="password" name="password" v-model="input.password" placeholder="Password">
        <button type="button" v-on:click="login()">Login</button>
    </div>
</template>

<script>
    import axios from 'axios'
    import BACKEND_PATH from './const'

export default {
    name: 'auth',
        data() {
            return {
                input: {
                    username: "",
                    password: ""
                },
                response: '',
                error_login: '',
                urlLogin: BACKEND_PATH + 'auth/login/'
            }
        },
        methods: {
            login() {
                if (this.input.username === "" && this.input.password === "") {
                    alert("A username and password must be present")
                    return false
                }
                axios
                    .post(this.urlLogin,
                        this.input,
                        {
                            headers:
                                {"Content-Type": 'application/json', 'Accept': 'application/json', }
                        })
                    .then(response => this.$store.state.token = response.data)
                    .then(() => this.getHeaders())
                    .then(() => this.$emit("authenticated", true) | this.$router.replace({name: "home"}))
                    .catch(error => alert(this.error_login = error.response.data.non_field_errors[0]))
                    .catch(() => alert('connection refused'))
            },
            getHeaders(){
                this.$store.state.headerSimple = {headers:{"Authorization": 'Token ' + this.$store.state.token.key,
                        "Content-Type": 'application/json', 'Accept': 'application/json'}}
                this.$store.state.headerFile = {headers:{"Authorization": 'Token ' + this.$store.state.token.key,
                        "Content-Type": 'multipart/form-data', 'Accept': 'application/json'}}
            }
        }
    }
</script>

<style scoped>
#login {
    width: 500px;
    border: 1px solid #CCCCCC;
    background-color: #FFFFFF;
    margin: auto;
    margin-top: 200px;
    padding: 20px;
}
</style>