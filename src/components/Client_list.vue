<template>
    <b-container fluid>
        <!-- User Interface controls -->
        <b-row>

            <b-col lg="6" class="my-1">
                <b-form-group
                        label="Filter"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="filterInput"
                        class="mb-0"
                >
                    <b-input-group size="sm">
                        <b-form-input
                                v-model="filter"
                                type="search"
                                id="filterInput"
                                placeholder="Type to Search"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <b-col sm="5" md="6" class="my-1">
                <b-button v-b-modal.visit pill variant="success">Add new visit</b-button>
                <b-button v-b-modal.client pill variant="outline-warning">Add new client</b-button>
            </b-col>
            <b-col sm="7" md="6" class="my-1">
                <b-form-group
                        label="Per page"
                        label-cols-sm="20"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="perPageSelect"
                        class="mb-0"
                >
                    <b-form-select
                            v-model="perPage"
                            id="perPageSelect"
                            size="sm"
                            :options="pageOptions"
                    ></b-form-select>
                </b-form-group>
            </b-col>
        </b-row>
        <div class="mt-3">
            <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    aria-controls="main_table"
                    align="fill"
                    size="sm"
            >
                <template v-slot:first-text><span class="text-info">First</span></template>
                <template v-slot:prev-text><span class="text-success">Prev</span></template>
                <template v-slot:next-text><span class="text-success">Next</span></template>
                <template v-slot:last-text><span class="text-info">Last</span></template>
            </b-pagination>
        </div>
        <b-table
                show-empty
                striped
                hover
                id="main_table"
                ref="table"
                stacked="md"
                :items="items"
                :fields="fields"
                :busy="isBusy"
                :total-rows="totalRows"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                @filtered="onFiltered"
        >
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
            <template v-slot:cell(index)="data">
                {{ data.index + 1 }}
            </template>
            <template v-slot:cell(photo)="row">
                <b-img :src=transformGDUrl(row.item.photo) width="100px" height="150px"></b-img>
            </template>
            <template v-slot:cell(url)="row">
                <b-button pill variant="outline-primary" :to="'/client/' + row.item.id">Detail</b-button>
            </template>
            <template v-slot:cell(delete)="row">
                <b-button pill @click="deleteClient(row)" variant="danger">delete</b-button>
            </template>
        </b-table>
        <div class="mt-3">
            <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    aria-controls="main_table"
                    align="fill"
                    size="lg"
            >
                <template v-slot:first-text><span class="text-info">First</span></template>
                <template v-slot:prev-text><span class="text-success">Prev</span></template>
                <template v-slot:next-text><span class="text-success">Next</span></template>
                <template v-slot:last-text><span class="text-info">Last</span></template>
            </b-pagination>
        </div>
        <div>
            <b-modal ok-only id='client' size="xl" ref="modal" centered>
                <b-form-group id="input-1" label="FIRST NAME:" label-for="input-1">
                    <b-form-input
                            id="input 1"
                            v-model="form.first_name"
                            required
                    ></b-form-input>

                </b-form-group>
                <b-form-group id="input-group-2" label="LAST NAME:" label-for="input-2">
                    <b-form-input
                            id="input-3"
                            v-model="form.last_name"
                            required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-3" label="TELEPHONE:" label-for="input-3">
                    <b-form-input
                            id="input-3"
                            v-model="form.telephone"
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-4" label="PHOTO:">
                    <b-form-file
                            placeholder="Choose a photo it here..."
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
                <b-button type="submit" @click="onSubmit" variant="primary">Submit</b-button>
                <b-button type="reset" @click="onReset" variant="danger">Reset</b-button>
            </b-modal>
            <b-modal ok-only id='visit' size="xl" ref="modal_visit" centered>
                <b-form>
                    <b-form-group id="input-group-3" label="Client" label-for="input-3">
                        <b-form-select
                                id="input-3"
                                v-model="formVisit.client"
                                :options="optionsClientName"
                                required
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group id="input-1" label="Date:" label-for="input-1">
                        <b-form-input type="date"
                                      id="input-1"
                                      v-model="formVisit.date_visit"
                                      required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-2">
                        <b-form-checkbox name="active" v-model="formVisit.manicure" value="true">MANICURE
                        </b-form-checkbox>
                    </b-form-group>
                    <b-form-group id="input-group-3" l>
                        <b-form-checkbox name="active" v-model="formVisit.pedicure" value="true">PEDICURE
                        </b-form-checkbox>
                    </b-form-group>
                    <b-form-group id="input-group-4">
                        <b-form-checkbox name="active" v-model="formVisit.manicure_correction" value="true">MANICURE
                            CORRECTION
                        </b-form-checkbox>
                    </b-form-group>
                    <b-form-group id="input-group-5">
                        <b-form-checkbox name="active" v-model="formVisit.pedicure_correction" value="true">PEDICURE
                            CORRECTION
                        </b-form-checkbox>
                    </b-form-group>
                    <b-form-group id="input-6" label="PAY:" label-for="input-2">
                        <b-form-input type="number"
                                      required
                                      id="input-6"
                                      v-model="formVisit.pay"
                                      placeholder='enter pay sum'
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-5">
                        <b-form-file placeholder="Choose a image it here..." v-model="formImageList"
                                     multiple></b-form-file>
                    </b-form-group>
                    <b-button pill @click="saveVisit" variant="success">Save new visit</b-button>
                    <b-button pill @click="onReset" variant="warning">Reset</b-button>
                </b-form>
            </b-modal>
        </div>


    </b-container>

</template>

<script>
    import axios from 'axios'
    import url from "@/components/const";

    export default {
        data() {
            return {
                isBusy: true,
                items: null,
                newClient: null,
                client: {
                    text: '',
                    value: '',
                },
                optionsClientName: [],
                fields: [
                    'index',
                    {key: 'first_name', label: 'Person first name', sortable: true, sortDirection: 'desc'},
                    {key: 'last_name', label: 'Person last name', sortable: true, class: 'text-center'},
                    {key: 'telephone', label: 'Telephone'},
                    {
                        key: 'active',
                        label: 'is Active',
                        formatter: (value) => {
                            return value ? 'Active' : 'No'
                        },
                        sortable: true,
                        sortByFormatted: true,
                        filterByFormatted: true
                    },
                    {key: 'photo', label: 'Photo', sortable: false},
                    {key: 'url', label: 'Detail', sortable: false},
                    'delete'
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 20, 30],
                filter: null,
                form: {
                    first_name: '',
                    last_name: '',
                    telephone: '',
                    active: '',
                    photo: null,
                },
                formImage: {
                    "visit": null,
                    "client": null,
                },
                formImageList: [],
                formVisit: {
                    client: '',
                    date_visit: "",
                    manicure: false,
                    pedicure: false,
                    manicure_correction: false,
                    pedicure_correction: false,
                    pay: "",
                },
                headers: this.$store.state.headerSimple,
                headersFile: this.$store.state.headerFile,
            }
        },
        mounted() {
            axios
                .get(url.clients + '?format=json', this.headers)
                .then(response => {
                    this.items = response.data;
                })
                .then(() => this.totalRows = this.items.length)
                .then(() => this.getClient())
                .then(() => this.isBusy = false)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
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
            addImageVisit() {
                if (this.formImageList) {
                    for (let image of this.formImageList) {
                        let imagePutId = null
                        let formData = new FormData();
                        formData.append('main_image', image);
                        axios.post(url.imageCreateBase, this.formImage, this.headers)
                            .then(response => {
                                imagePutId = [response.data.id]
                            })
                            .then(() => {
                                axios.put((url.imagePut + imagePutId + '/'), formData, this.headersFile)
                            })
                            .catch(function (error) {
                                alert('FAILURE!!')
                            })
                    }
                }
            },
            saveVisit() {
                axios
                    .post(url.visits, this.formVisit, this.headers)
                    .then(response => {
                        this.formImage.visit = response.data.id;
                        this.formImage.client = response.data.client
                    })
                    .then(() => this.addImageVisit())
                    .then(() => this.$refs.modal_visit.hide())
                    .then(() => this.onReset())
                    .then(() => alert('okey-dokey'))
                    .catch(function (error) {
                        alert('FAILURE!!')
                    })
            },
            onUpdate() {
                this.$refs.table.refresh();
            },
            onReset() {
                this.formVisit = {
                    client: '',
                    date_visit: "",
                    manicure: false,
                    pedicure: false,
                    manicure_correction: false,
                    pedicure_correction: false,
                    pay: "",
                };
                this.formImage = {
                    "visit": null,
                    "client": null,
                };
                this.formImageList = [];
                this.form = {
                    first_name: '',
                    last_name: '',
                    telephone: '',
                    active: '',
                    photo: null,
                };

            },
            getClient() {
                this.optionsClientName = [];
                for (let item of this.items) {
                    this.client = {}
                    this.client.text = item.first_name + ' ' + item.last_name;
                    this.client.value = item.id;
                    this.optionsClientName.push(this.client)

                }
            },
            deleteClient(row) {
                if (!confirm('Are You sure?')) {
                    return
                }
                if (!confirm('you thought well?')) {
                    return;
                }
                axios
                    .delete(
                        url.clients + row.item.id + '/', this.headers)
                    .then(() => this.items.splice(row.index, 1))
                    .then(() => this.onUpdate())
                    .then(() => alert('client permanently deleted'))

            },
            onSubmit() {
                let formData = new FormData();
                formData.append('photo', this.form.foto);
                axios.post(
                    url.clients,
                    this.form,
                    this.headers)
                    .then(response => {
                        this.newClient = response.data
                    })
                    .then(() => {
                        if (formData.get('foto')) {
                            axios.put(
                                (url.client_photo + this.newClient.id + '/'),
                                formData,
                                this.headersFile
                            ).then(response => {
                                this.newClient.photo = response.data.photo
                            })
                        }
                    })
                    .then(() => this.items.push(this.newClient))
                    .then(() => this.getClient())
                    .catch(function (error) {
                        alert('FAILURE!!')
                    })
                    .then(() => alert('your changes are accepted!'))
                    .then(() => this.$refs.modal.hide())
                    .then(() => this.onReset())
                    .then(() => this.onUpdate())
            },
            onFiltered(filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
        }
    }
</script>