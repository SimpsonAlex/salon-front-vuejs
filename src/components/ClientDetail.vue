<template>
    <div>
        <b-tabs content-class="mt-3">
            <b-tab title="Data Detail">
                <ClientDataDetail/>
            </b-tab>

            <b-tab title="Visits Detail">
                <ClientVisitDetail/>
            </b-tab>

            <b-tab title="Client Image">
                <ClientImage/>
            </b-tab>
        </b-tabs>
    </div>


</template>

<script>
    import ClientDataDetail from "@/components/ClientDataDetail";
    import ClientVisitDetail from "@/components/ClientVisitDetail";
    import ClientImage from "@/components/ClientImage";

    export default {
        name: "ClientDetail",
        components: {
            ClientVisitDetail,
            ClientDataDetail,
            ClientImage
        }
    }
</script>

<style scoped>

</style>