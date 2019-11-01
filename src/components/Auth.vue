<template>
    <div id="login">
        <div v-if="!isBusyLogin">
            <h1>Login</h1>
            <input type="text" name="username" v-model="input.username" placeholder="Username">
            <input type="password" name="password" v-model="input.password" placeholder="Password">
            <button type="button" @click="login">Login</button>
        </div>
        <b-spinner v-if="isBusyLogin"></b-spinner>
    </div>
</template>

<script>
    import axios from 'axios'
    import url from "@/components/const";

    export default {
        name: 'auth',
        data() {
            return {
                isBusyLogin: false,
                input: {
                    username: "",
                    password: ""
                },
            }
        },
        methods: {
            login() {
                if (this.input.username === "" && this.input.password === "") {
                    alert("A username and password must be present")
                    return false
                }
                this.isBusyLogin = true;
                axios
                    .post(url.login,
                        this.input,
                        {
                            headers:
                                {"Content-Type": 'application/json', 'Accept': 'application/json',}
                        })
                    .then(response => localStorage.setItem('token', response.data.key) )
                    .then(() => this.getHeaders())
                    .then(() => this.$emit("authenticated", true) | this.$router.replace({name: "home"}))
                    .catch(error => alert(error.response.data.non_field_errors[0]))
                    .catch(() => alert('connection refused'))
                    .finally(() => (this.isBusyLogin = false))
            },
            getHeaders() {
                this.$store.state.headerSimple = {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem('token')}`,
                        "Content-Type": 'application/json', 'Accept': 'application/json'
                    }
                }
                this.$store.state.headerFile = {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem('token')}`,
                        "Content-Type": 'multipart/form-data', 'Accept': 'application/json'
                    }
                }
            }
        },

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