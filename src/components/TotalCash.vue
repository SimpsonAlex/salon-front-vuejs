<template>
    <div>

        <b-form inline>
            <b-form-group id="input-0" label="Client:" label-for="input-0">
                <b-form-select
                        id="input-0"
                        v-model="client"
                        :options="optionsClientName"
                >
                    <template v-slot:first>
                        <option value="">-- not use filter client --</option>
                    </template>
                </b-form-select>
            </b-form-group>
            <b-form-group id="input-1" label="Date:" label-for="input-1">
                <b-form-input type="date"
                              id="input-1"
                              v-model="startDate"
                              class="mb-2 mr-lg-2-2 mb-lg-0"
                ></b-form-input>
            </b-form-group>
            <b-form-group id="input-2" label="Date:" label-for="input-2">
                <b-form-input type="date"
                              id="input-2"
                              v-model="finishDate"
                ></b-form-input>
            </b-form-group>
            <b-button pill @click="getInfo()" variant="success">Submit</b-button>
        </b-form>
        <b-form-group label="Filter On" description="Leave all unchecked to filter on all data" class="mb-0">
            <b-form-checkbox-group v-model="filterOn" class="mt-1">
                <b-form-checkbox value="manicure">manicure</b-form-checkbox>
                <b-form-checkbox value="pedicure">pedicure</b-form-checkbox>
                <b-form-checkbox value="manicure_correction">manicure_correction</b-form-checkbox>
                <b-form-checkbox value="pedicure_correction">pedicure_correction</b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
        <b-table @filtered="filterEmit" :fields="fields" :items="itemsToTable" filter="true" bordered hover
                 :filterIncludedFields="filterOn" :tbody-tr-class="rowClass" head-variant="dark">
            <template v-slot:cell(client)="data">
                {{getClientName(data)}}
            </template>
            <template v-slot:custom-foot="data">
                <b-tr>
                    <b-th colspan="5" class="alert-primary">TOTAL PAY</b-th>
                    <b-th class="alert-light">{{getTotalPay()}}</b-th>
                </b-tr>
            </template>

        </b-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import url from "@/components/const";

    export default {
        data() {
            return {
                isBusy: false,
                items: null,
                itemsToTable: [],
                filter: null,
                filterOn: [],
                client: '',
                optionsClientName: [],
                payList: [],
                startDate: (new Date()).toISOString().slice(0, 10),
                finishDate: (new Date()).toISOString().slice(0, 10),
                headerSimple: this.$store.state.headerSimple,
                headerFile: this.$store.state.headerFile,
                fields: [
                    {key: 'client', label: "CLIENT"},
                    {
                        key: 'manicure', label: "MANICURE", sortable: true, formatter: (value) => {
                            return value ? 'Yes' : 'No'
                        }
                    },
                    {
                        key: 'pedicure', label: 'PEDICURE', sortable: true, formatter: (value) => {
                            return value ? 'Yes' : 'No'
                        }
                    },
                    {
                        key: 'manicure_correction',
                        label: "MANICURE CORRECTION",
                        sortable: true,
                        formatter: (value) => {
                            return value ? 'Yes' : 'No'
                        }
                    },
                    {
                        key: 'pedicure_correction',
                        label: 'PEDICURE CORRECTION',
                        sortable: true,
                        formatter: (value) => {
                            return value ? 'Yes' : 'No'
                        }
                    },
                    {key: 'pay', label: 'PAY', sortable: true},
                ]
            }
        },
        mounted() {
            axios
                .get(url.client_without_photo + '?format=json', this.headerSimple)
                .then(response => {
                    this.items = response.data;
                })
                .then(() => this.getClient())
                .then(() => this.isBusy = false)
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));

        },
        methods: {
            getInfo() {
                axios
                    .get(`${url.visits_only}?visit_after=${this.startDate}&visit_before=${this.finishDate}&client=${this.client}`,
                        this.headerSimple)
                    .then(response => {
                        this.itemsToTable = response.data;
                        this.responseParse()
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            responseParse() {
                let test = {}
                for (let visit of this.items) {
                    if (test[visit.client]) {
                        test[visit.client]['pay'] = test[visit.client]['pay'] + parseFloat(visit.pay)
                        test[visit.client]['visit'] += 1
                    } else {
                        test[visit.client] = {}
                        test[visit.client]['pay'] = parseFloat(visit.pay)
                        test[visit.client]['visit'] = 1
                    }
                }
            },
            filterEmit(data) {
                this.payList = data
            },
            getTotalPay() {
                let totalPay = 0
                for (let visit of this.payList) {
                    totalPay += parseFloat(visit.pay)
                }
                return totalPay
            },
            getClient() {
                for (let item of this.items) {
                    let clientData = {};
                    clientData.text = item.first_name + ' ' + item.last_name;
                    clientData.value = item.id;
                    this.optionsClientName.push(clientData)
                }
            },
            getClientName(data) {
                for (let client of this.optionsClientName) {
                    if (client.value === data.item.client) {
                        return client.text
                    }
                }
                return 'hello'
            },
            rowClass(item, type){
                if(!item) return
                if (item.pay < 0) {
                    return 'table-danger'
                }else{
                    return 'table-success'
                }
            }

        }
    }
</script>

<style scoped>

</style>