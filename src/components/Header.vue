<template>
    <div>
        <b-card title="Card Title" no-body>
            <b-card-header center header-tag="nav">
                <b-nav tabs align="center">
                    <b-nav-item to="/calendar" exact exact-active-class="active">Calendar</b-nav-item>
                    <b-nav-item to="/clients_list" exact exact-active-class="active">Clients list</b-nav-item>
                    <b-nav-item to="/image" exact exact-active-class="active">Image</b-nav-item>
                </b-nav>
            </b-card-header>
            <b-card-body>
                <router-view></router-view>
            </b-card-body>
        </b-card>

    </div>
</template>

<script>
    export default {
        name: ""
    }
</script>

<style scoped>


</style>