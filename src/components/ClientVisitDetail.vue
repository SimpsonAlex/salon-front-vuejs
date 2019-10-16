<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm" ref="table">
      <template v-slot:cell(index)="data">
          {{ data.index + 1 }}
      </template>
      <template v-slot:cell(client)="data">
          {{data.item.client[1].first_name}}     {{data.item.client[0].last_name}}
      </template>

      <template v-slot:cell(image)="row">
          <b-button size="sm" @click="showImage(row.toggleDetails, row.item.date_visit)" class="mr-2">
              Image
          </b-button>
      </template>
      <template v-slot:cell(details)="row">
          <b-button v-if="!row.detailsShowing" size="sm" @click="changeVisit(row.toggleDetails, row.item.id)" class="mr-1">
              Change Visit
          </b-button>
      </template>
      <template v-slot:row-details="row">
          <div v-if="showImages" class="p-4 bg-dark">
                  <b-row>
                    <b-col v-for="photo in row.item.image" :key="photo.id">
                           <b-img-lazy v-if="photo.main_image" v-b-modal.mod :src='photo.main_image' @click.native='modalParrametres(photo.main_image, row.item.image, photo, photo.id)' height="200px" width="300px"></b-img-lazy>
                           <b-img v-else :src="photo.main_image" v-b-modal='' @click.native='modalParrametres(photo.main_image, row.item.image, photo, photo.id)'  height="200px" width="300px"></b-img>
                    </b-col>
                  </b-row>
                  <b-button @click="row.toggleDetails" variant="primary">HIDE</b-button>
          <div>
            <b-dropdown id="dropdown-form" text="Add new image" ref="dropdown">
              <b-dropdown-form>
                <b-form-group size="lg">
                  <b-form-file size="lg" v-model="addImageForm.main_image" plain></b-form-file>
                </b-form-group>
               <b-button pill size="lg" @click="addImage(row.item.id, row.item.image)" variant="primary">submit</b-button>
              </b-dropdown-form>
              <b-dropdown-divider></b-dropdown-divider>
            </b-dropdown>
          </div>
          </div>
          <div v-else-if="showChangeVisit && row.item.id === itemsVisitDetail.id">
              <b-card>
                <b-form inline>
                  <b-form-group id="input-1" label="Date:" label-for="input-1">
                      <b-form-input type="date"
                      id="input-1"
                      v-model="form.date_visit"
                      ></b-form-input>
                  </b-form-group>
                  <b-form-group id="input-group-2" >
                      <b-form-checkbox name="active" v-model="form.manic" value="true">MANICURE</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-3" l>
                      <b-form-checkbox name="active" v-model="form.nomanic" value="true">PEDICURE</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-4" >
                      <b-form-checkbox name="active" v-model="form.cor_manic" value="true">MANICURE CORRECTION</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-5">
                      <b-form-checkbox name="active" v-model="form.cor_no_manic" value="true">PEDICURE CORRECTION</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-6" label="PAY:" label-for="input-2">
                      <b-form-input type="number"
                      id="input-6"
                      v-model="form.pay"
                      ></b-form-input>
                  </b-form-group>
                  <b-button pill @click="onSubmit(form.id, row)" variant="success">Submit</b-button>
                  <b-button pill @click="onReset" variant="warning">Reset</b-button>
                  <b-button @click="onDelete(form.id, row)" variant="danger">DELETE</b-button>
                  <b-button @click="row.toggleDetails" variant="primary">HIDE</b-button>
                </b-form>
              </b-card>
          </div>
          <div v-else-if="row.detailsShowing && !showImages || row.toggleDetails()">
          </div>

      </template>
    </b-table>
       <div>
          <b-modal id='mod' size="xl" ref="modal" centered >
            <b-img :src='imageDeleteForm.src' width="1000px" height="1000px"></b-img>
            <b-button @click="imageDelete(imageDeleteForm)" variant="danger">DELETE</b-button>
          </b-modal>
       </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
        items: null,
        itemsVisitDetail: {},
        imagePutId: null,
        url: ('http://127.0.0.1:8000/clients/' + this.$route.params.id + '/?format=json'),
        urlDetailVisit: 'http://127.0.0.1:8000/visit_detail/',
        urlImagePost: "http://127.0.0.1:8000/images/",
        urlImagePut: 'http://127.0.0.1:8000/image_create/',
        urlImageDelete: 'http://127.0.0.1:8000/image_create/',
        fields:[
            'index',
            {key:'client', label:'CLIENT'},
            {key: 'date_visit', label:"DATE"},
            {key: 'manic', label: "MANICURE", formatter: (value) => {
            return value ? 'Yes' : 'No'} },
            {key: 'nomanic', label: 'PEDICURE',  formatter: (value) => {
            return value ? 'Yes' : 'No'} },
            {key: 'cor_manic', label: "MANICURE CORRECTION", formatter: (value) => {
            return value ? 'Yes' : 'No'} },
            {key: 'cor_no_manic', label: 'PEDICURE CORRECTION',  formatter: (value) => {
            return value ? 'Yes' : 'No'} },
            {key: 'pay', label: 'PAY'},
            {key: 'image', label: 'IMAGE'},
            'details'
        ],
        imageDeleteForm: {
            src: '',
            row: '',
            id_refresh: '',
            id_delete: '',
        },
        form: {
            id: "",
            date_visit: "",
            manic: '',
            nomanic: "",
            cor_manic: "",
            cor_no_manic: "",
            pay: "",
            client: ""
        },
        addImageForm:{
            "main_image": [],
            "visit": null,
            "item": null,
        },
        showImages: false,
        showChangeVisit: false,

      }
    },
    methods: {
       showDetails(id){
           return axios
            .get(this.urlDetailVisit + id + '/')
            .then(response => {this.itemsVisitDetail = response.data;
            }).catch(error => {
              console.log(error);
              this.errored = true;
            })
            .finally(() => (this.loading = false));

       },
       showImage(func){
           this.showImages= true
           func()
           this.showChangeVisit = false
       },
       modalParrametres(src, row, photo, id){

           this.imageDeleteForm.src = src;
           this.imageDeleteForm.row = row;
           this.imageDeleteForm.id_refresh = photo;
           this.imageDeleteForm.id_delete = id;
       },
       changeVisit(func, id){
            this.showDetails(id).then(() => {this.form = this.itemsVisitDetail}).then(() =>  func())
            this.showImages = false
            this.showChangeVisit = true
        },
       onReset(){
           this.form = this.itemsVisitDetail
        },
       onDelete(id, row){
           let itSure = confirm('Are you sure want to delete this Visit Detail Instance?');
           if (itSure) {
               axios
                   .delete((this.urlDetailVisit + id + '/'),
                       {headers: {"Content-Type": 'application/json', 'Accept': 'application/json'}})
                   .then(() => row.toggleDetails())
                   .then(() => this.items.splice(row.index, 1))
                   .then(() => this.onUpdate())
               } else {
               alert('Visit is not deleted')
              }
       },
       onSubmit(id, row) {
            axios
            .put((this.urlDetailVisit + id + '/'),
                this.form,{
                    headers:
                        {"Content-Type": 'application/json', 'Accept': 'application/json'}
            }).then(response => this.applyChange(response.data, row)).
            catch(function(error) {alert('FAILURE!!')}).
            then(() => this.onUpdate()).
            then(() => row.toggleDetails())
        },
       onUpdate() {
            this.$refs.table.refresh();
        },
       applyChange(responseData, row){
            row.item.date_visit = responseData.date_visit
            row.item.manic = responseData.manic
            row.item.nomanic = responseData.nomanic
            row.item.cor_manic = responseData.cor_manic
            row.item.cor_no_manic = responseData.cor_no_manic
            row.item.pay = responseData.pay
        },
       addImage(idVisit, row_item_image){

            if(!this.addImageForm.main_image){
                return alert ('image is not selected')
            }else {
                this.addImageForm.visit = idVisit
                this.$refs.dropdown.hide(true)
                let formData = new FormData();
                formData.append('main_image', this.addImageForm.main_image)
                axios.post(
                    this.urlImagePost,
                    this.addImageForm,
                    {
                        headers:
                            {"Content-Type": 'application/json', 'Accept': 'application/json'}
                    })
                    .then(response => {
                        this.imagePutId = [response.data.id]
                    })
                    .then(() => {
                        if (formData.get('main_image')) {
                            axios.put(
                                (this.urlImagePut + this.imagePutId + '/'),
                                formData,
                                {headers: {"Content-Type": 'multipart/form-data', 'Accept': 'application/json'}}
                            )
                                .then(response => {
                                    row_item_image.push(response.data)
                                }).then(() => this.onUpdate())
                        }
                    }).catch(function (error) {
                    alert('FAILURE!!')
                }).then(() => alert('your changes are accepted!'))
            }
        },
       imageDelete(imageDeleteForm){
           let itSure = confirm('delete this photo?');
           if (itSure) {
            axios
            .delete((this.urlImageDelete + imageDeleteForm.id_delete + '/'),
                {headers: {"Content-Type": 'application/json', 'Accept': 'application/json'}})
            .then(() => imageDeleteForm.row.splice(imageDeleteForm.row.indexOf(imageDeleteForm.id_refresh),1))
            .then(() => this.onUpdate()).then(() => this.$refs.modal.hide())

            }else {
               alert('Images is not deleted')
              }
            }
        },
       mounted() {
         axios
         .get(this.url)
         .then(response => {this.items = response.data.visit;})
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