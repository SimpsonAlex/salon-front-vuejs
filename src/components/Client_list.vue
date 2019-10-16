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
            <b-button v-b-modal.visit pill  variant="success">Add new visit</b-button>
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
      :total-rows="totalRows"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      @filtered="onFiltered"
    >
      <template v-slot:cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template v-slot:cell(foto)="row">
        <img :src=row.item.foto width="100px" height="150px">
      </template>
      <template v-slot:cell(url)="row">
        <b-button pill variant="outline-primary" :href="'/client/' + row.item.id">Detail</b-button>
      </template>
      <template v-slot:cell(delete)="row">
        <b-button pill @click="deleteClient(row)" variant="danger" >delete</b-button>
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
          <b-modal id='client' size="xl" ref="modal" centered >
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
                            v-model="form.telepfon"
                        ></b-form-input>
                      </b-form-group>
                      <b-form-group id="input-group-4" label="PHOTO:" label-for="input-4" >
                        <b-form-file
                            id="input-4"
                            v-model="form.foto"
                        ></b-form-file>
                      </b-form-group>

                       <b-form-group id="input-group-5" label="IS ACTIVE?">
                        <b-form-group v-model="form.active" >
                          <b-form-radio name="active" v-model="form.active" value="true">ACTIVE</b-form-radio>
                          <b-form-radio name="active" v-model="form.active" value="false">NO ACTIVE</b-form-radio>
                        </b-form-group>
                       </b-form-group>
                      <b-button type="submit" @click="onSubmit" variant="primary">Submit</b-button>
                      <b-button type="reset" @click="onReset" variant="danger">Reset</b-button>
          </b-modal>
          <b-modal id='visit' size="xl" ref="modal_visit"  centered>
                <b-form>
                  <b-form-group id="input-group-3" label="Client" label-for="input-3">
                    <b-form-select
                      id="input-3"
                      v-model="formVisit.client"
                      :options="optionsClientName"
                      required
                      placeholder='select name'
                    ></b-form-select>
                  </b-form-group>
                  <b-form-group id="input-1" label="Date:" label-for="input-1">
                      <b-form-input type="date"
                      id="input-1"
                      v-model="formVisit.date_visit"
                      required
                      ></b-form-input>
                  </b-form-group>
                  <b-form-group id="input-group-2" >
                      <b-form-checkbox name="active"  v-model="formVisit.manic" value="true">MANICURE</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-3" l>
                      <b-form-checkbox name="active" v-model="formVisit.nomanic" value="true">PEDICURE</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-4" >
                      <b-form-checkbox name="active" v-model="formVisit.cor_manic" value="true">MANICURE CORRECTION</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-5">
                      <b-form-checkbox name="active" v-model="formVisit.cor_no_manic" value="true">PEDICURE CORRECTION</b-form-checkbox>
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
                       <b-form-file  placeholder="Choose a image it here..." v-model="formImageList" multiple></b-form-file>
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

export default {
  data() {
    return {

      items: null,
      newClient: null,
      client: {
          text: '',
          value: '',
      },
      optionsClientName: [],
      fields: [
          'index',
        { key: ('first_name'), label: 'Person first name', sortable: true, sortDirection: 'desc' },
        { key: 'last_name', label: 'Person last name', sortable: true, class: 'text-center' },
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
        {key: 'foto', label: 'Photo', sortable: false},
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
          telepfon: '',
          active: '',
          foto: '',
        },
      formImage: {
        "visit": null,
        "item": null,
      },
      formImageList:[],
      formVisit:{
        client: '',
        date_visit: "",
        manic: false,
        nomanic: false,
        cor_manic: false,
        cor_no_manic: false,
        pay: "",
      },
      urlCreateClient: ('http://127.0.0.1:8000/create-client/'),
      urlDeleteClient: ('http://127.0.0.1:8000/clients/'),
      urlPhotoPut: ('http://127.0.0.1:8000/photo/'),
      urlCreateVisit: 'http://127.0.0.1:8000/visit_detail/',
      urlImagePost: "http://127.0.0.1:8000/images/",
      urlImagePut: 'http://127.0.0.1:8000/image_create/',
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted() {
  axios
    .get('http://127.0.0.1:8000/listclients/?format=json')
    .then(response => {this.items = response.data;
    })
    .then(() => this.totalRows = this.items.length)
    .then(() => this.getClient())
    .catch(error => {
      console.log(error);
      this.errored = true;
    })
    .finally(() => (this.loading = false));
},
  methods: {
  addImageVisit(){
        if (this.formImageList){
            for (let image of this.formImageList){
                console.log(image)
                let imagePutId = null
                let formData = new FormData();
                formData.append('main_image', image);
                axios.post(
                    this.urlImagePost,
                    this.formImage,
                      {
                         headers:
                         {"Content-Type": 'application/json', 'Accept': 'application/json'}
                      })
                    .then(response => {
                            imagePutId = [response.data.id]
                        })
                    .then(() => {
                        axios.put(
                            (this.urlImagePut + imagePutId + '/'),
                            formData,
                            {headers: {"Content-Type": 'multipart/form-data', 'Accept': 'application/json'}}
                            )
                        })
                    .catch(function (error) {
                            alert('FAILURE!!')
                        })
            }
        }
    },
  saveVisit(){
        axios
            .post(this.urlCreateVisit,
                this.formVisit,{
                    headers:
                        {"Content-Type": 'application/json', 'Accept': 'application/json'}
            })
            .then(response => {this.formImage.visit = response.data.id; this.formImage.item = response.data.client})
            .then(() => this.addImageVisit())
            .then(() => this.$refs.modal_visit.hide())
            .then(() => this.onReset())
            .catch(function(error) {alert('FAILURE!!')})
    },
  onUpdate() {
        this.$refs.table.refresh();
    },
  onReset(){
        this.formVisit = {
            client: '',
            date_visit: "",
            manic: false,
            nomanic: false,
            cor_manic: false,
            cor_no_manic: false,
            pay: "",
      };
      this.formImage = {
        "visit": null,
        "item": null,
      };
      this.formImageList = [];
      this.form = {
          first_name: '',
          last_name: '',
          telepfon: '',
          active: '',
          foto: '',
        };

    },
  getClient(){
      this.optionsClientName = [];
      for (let item of this.items){
          this.client = {}
          this.client.text = item.first_name + ' ' + item.last_name;
          this.client.value = item.id;
          this.optionsClientName.push(this.client)

      }
    },
  deleteClient(row){
        axios
            .delete(
                this.urlDeleteClient + row.item.id + '/',
                {headers: {"Content-Type": 'application/json', 'Accept': 'application/json'}}
            )
            .then(() => this.items.splice(row.index, 1))
            .then(() => this.onUpdate())

    },
  onSubmit(){
        let formData = new FormData();
        formData.append('foto', this.form.foto);
        axios.post(
            this.urlCreateClient,
            this.form,
            {
                headers:
                    {"Content-Type": 'application/json', 'Accept': 'application/json'}
            })
            .then(response => {this.newClient = response.data})
            .then(() => {
            if (formData.get('foto')){
                axios.put(
                    (this.urlPhotoPut + this.newClient.id + '/'),
                    formData,
                    {headers: {"Content-Type": 'multipart/form-data', 'Accept': 'application/json'}}
                    ).then(response => {this.newClient.foto = response.data.foto})
            }})
            .then(() => this.items.push(this.newClient))
            .then(() => this.getClient())
            .catch(function(error) {alert('FAILURE!!')})
            .then(() => alert('your changes are accepted!'))
            .then(() => this.$refs.modal.hide())
            .then(() => this.onReset())
            .then(() => this.onUpdate())
      },
  onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  }
}
</script>