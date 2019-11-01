<template>
    <div>

        <div>
            <b-table v-if="!show" stacked :items="items" :busy="isBusy" :fields="fields" ref="table" dark>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                        <b-spinner variant="primary" label="Spinning"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
                <template v-slot:cell(photo)="row">
                    <b-img :src=transformGDUrl(row.item.photo) height="400px" width="200px"></b-img>
                </template>
            </b-table>
            <b-button pill :variant='show?variant="outline-primary":variant="success"'
                      @click="show = !show"> {{show?'Hide changer options':'Show changer options'}}
            </b-button>
        </div>
        <div>
            <b-spinner v-if="isBusyChangeClient">load.......</b-spinner>
            <b-form @reset="onReset" v-if="show && !isBusyChangeClient">
                <b-form-group id="input-1" label="FIRST NAME:" label-for="input-2">
                    <b-form-input
                            id="input 1"
                            v-model="form.first_name"
                    ></b-form-input>

                </b-form-group>
                <b-form-group id="input-group-2" label="LAST NAME:" label-for="input-2">
                    <b-form-input
                            id="input-3"
                            v-model="form.last_name"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-3" label="TELEPHONE:" label-for="input-3">
                    <b-form-input
                            id="input-3"
                            v-model="form.telephone"
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-4" label="PHOTO:" label-for="input-4">
                    <b-form-file
                            id="input-4"
                            v-model="form.photo"
                    ></b-form-file>
                </b-form-group>

                <b-form-group id="input-group-5" label="IS ACTIVE?">
                    <b-form-group v-model="form.active">
                        <b-form-radio name="active" v-model="form.active" value="true">ACTIVE</b-form-radio>
                        <b-form-radio name="active" v-model="form.active" value="false">NO ACTIVE</b-form-radio>
                    </b-form-group>
                </b-form-group>
                <b-button @click="onSubmit" variant="primary">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import url from "@/components/const";

    export default {
        data() {
            return {
                isBusy: true,
                isBusyChangeClient: false,
                items: [],
                it: {},
                headerSimple: this.$store.state.headerSimple,
                headerFile: this.$store.state.headerFile,
                url: `${url.clients}${this.$route.params.id}/?format=json`,
                urlPhotoPut: `${url.client_photo}${this.$route.params.id}/`,
                fields: [
                    {key: 'first_name', label: "FIRST NAME"},
                    {key: 'last_name', label: "LAST NAME"},
                    {key: 'telephone', label: "PHONE"},
                    {
                        key: 'active', label: 'ACTIVE', formatter: (value) => {
                            return value ? 'Yes' : 'No'
                        }
                    },
                    {key: 'photo', label: 'PHOTO'},
                ],
                form: {
                    id: '',
                    first_name: '',
                    last_name: '',
                    telephone: '',
                    active: '',
                    photo: [],
                },
                show: false
            }
        },
        methods: {
            transformGDUrl(url) {
                if (!url) {
                    return url
                }
                let base = 'https://drive.google.com/uc?export=view&id='
                url = url.split('/')
                url = base + url[url.length - 2]
                return url
            },
            onSubmit() {
                let formData = new FormData();
                formData.append('photo', this.form.photo)
                this.isBusyChangeClient = true
                axios.put(
                    this.url,
                    this.form,
                    this.headerSimple)
                    .then(response => {
                        this.items = [response.data]
                    })
                    .then(() => {
                        if (formData.get('photo')) {
                            axios
                                .put(this.urlPhotoPut, formData, this.headerFile)
                                .then(response => {
                                    this.items[0].photo = response.data.photo
                                })
                                .then(() => alert('your changes are accepted!'))
                                .then(() => this.hideChangerOptions() | (this.isBusyChangeClient = false))
                                .then(() => this.onUpdate())
                        } else {
                            this.hideChangerOptions()
                            alert('your changes are accepted!')
                            this.isBusyChangeClient = false
                        }
                    })
                    .catch(function (error) {
                        alert('FAILURE!!')
                    })
            },
            onReset(evt) {
                evt.preventDefault()
                // Reset our form values
                this.form.first_name = this.it.first_name
                this.form.last_name = this.it.last_name
                this.form.telephone = this.it.telephone
                this.form.active = this.it.active
                this.show = false
                this.$nextTick(() => {
                    this.show = true
                })
            },
            fillingOutFormsWithClientData(items) {
                this.form.id = items.id
                this.form.first_name = items.first_name
                this.form.last_name = items.last_name
                this.form.telephone = items.telephone
                this.form.active = items.active
                this.isBusy = false

            },
            showChangerOptions() {
                // this.show = (this.show? false: true)
            },
            hideChangerOptions() {
                this.show = false
            },
            onUpdate() {
                this.$refs.table.refresh();
            }
        },
        mounted() {
            axios
                .get(this.url, this.headerFile)
                .then(response => {
                    this.it = response.data
                })
                .then(() => this.fillingOutFormsWithClientData(this.it)).then(() => {
                this.items = [this.it]
            })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },

    }
</script>

<style scoped>

</style>