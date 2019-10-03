<template>
    <div>
     <b-card title="Card Title" no-body>
        <b-card-header center header-tag="nav">
          <b-nav tabs align="center">
            <b-nav-item to="/create" exact exact-active-class="active">Create</b-nav-item>
            <b-nav-item to="/foo" exact exact-active-class="active">Foo</b-nav-item>
            <b-nav-item to="/clients_list" exact exact-active-class="active">Clients list</b-nav-item>
            <b-nav-item>Disabled</b-nav-item>
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