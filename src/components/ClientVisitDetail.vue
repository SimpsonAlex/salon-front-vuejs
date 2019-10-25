<template>
  <div>
    <b-form inline>
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
      <b-button pill @click="select()" variant="success">Submit</b-button>
    </b-form>
    <b-table :items="items" :fields="fields" :busy="isBusyTable" striped responsive="sm" ref="table">
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner variant="primary" label="Spinning"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(index)="data">
          {{ data.index + 1 }}
      </template>
      <template v-slot:cell(client)="data">
          {{data.item.client[1].first_name}}     {{data.item.client[0].last_name}}
      </template>

      <template v-slot:cell(image)="row">
          <b-button size="sm" @click="showImage(row.toggleDetails, row.item.id, row.detailsShowing)" class="mr-2">
              <b-spinner v-if="isBusyImage[row.item.id]" variant="primary" label="Spinning"></b-spinner>
              Image
          </b-button>
      </template>
      <template v-slot:cell(details)="row">
          <b-button v-if="!row.detailsShowing" size="sm" @click="showDetails(row.toggleDetails, row.item)" class="mr-1">
              Change Visit
          </b-button>
      </template>
      <template v-slot:row-details="row">
          <div v-if="showImages" class="p-4 bg-dark">
              <b-spinner v-if="isBusyImage[row.item.id]" variant="primary" label="Spinning"></b-spinner>
                  <b-row>
                    <b-col v-for="photo in imageVisitDetail[row.item.id].image" :key="photo.id">
                           <b-img-lazy v-if="photo.main_image" v-b-modal.mod :src='transformGDUrl(photo.main_image)' @click.native='modalParrametres(photo.main_image, row.item.image, photo, photo.id)' height="200px" width="300px"></b-img-lazy>
                           <b-img v-else :src="transformGDUrl(photo.main_image)" v-b-modal.mod @click='modalParrametres(photo, row.item.image, photo, photo.id)'  height="200px" width="300px"></b-img>
                    </b-col>
                  </b-row>
                  <b-button @click="row.toggleDetails" variant="primary">HIDE</b-button>
          <div>
                <b-form inline>
                  <b-form-file  v-model="addImageForm.main_image"></b-form-file>
                  <b-button pill  @click="addImage(row.item.id, row.item.image)" variant="primary">Add file</b-button>
                </b-form>
          </div>
          </div>
          <div v-else-if="showChangeVisit && row.item.id === form[row.item.id].id">

              <b-card>
                <b-spinner v-if="isBusyDetail[row.item.id]" variant="primary" label="Spinning"></b-spinner>
                <b-form inline>
                  <b-form-group id="input-1" label="Date:" label-for="input-1">
                      <b-form-input type="date"
                      id="input-1"
                      v-model="form[row.item.id].date_visit"
                      ></b-form-input>
                  </b-form-group>
                  <b-form-group id="input-group-2" >
                      <b-form-checkbox name="active" v-model="form[row.item.id].manic" value="true">MANICURE</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-3" l>
                      <b-form-checkbox name="active" v-model="form[row.item.id].nomanic" value="true">PEDICURE</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-4" >
                      <b-form-checkbox name="active" v-model="form[row.item.id].cor_manic" value="true">MANICURE CORRECTION</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-group-5">
                      <b-form-checkbox name="active" v-model="form[row.item.id].cor_no_manic" value="true">PEDICURE CORRECTION</b-form-checkbox>
                  </b-form-group>
                  <b-form-group id="input-6" label="PAY:" label-for="input-2">
                      <b-form-input type="number"
                      id="input-6"
                      v-model="form[row.item.id].pay"
                      ></b-form-input>
                  </b-form-group>
                  <b-button pill @click="onSubmit(form[row.item.id].id, row)" variant="success">Submit</b-button>
                  <b-button pill @click="onReset" variant="warning">Reset</b-button>
                  <b-button @click="onDelete(form[row.item.id].id, row)" variant="danger">DELETE</b-button>
                  <b-button @click="row.toggleDetails" variant="primary">HIDE</b-button>
                </b-form>
              </b-card>
          </div>
      </template>
    </b-table>
    <div>
          <b-modal id='mod' size="xl" ref="modal" centered >
            <b-img :src='transformGDUrl(imageDeleteForm.src)' width="1000px" height="1000px"></b-img>
            <b-button @click="imageDelete(imageDeleteForm)" variant="danger">DELETE</b-button>
          </b-modal>
       </div>
  </div>
</template>

<script>
import axios from 'axios'
import url from "@/components/const";

export default {
  data() {
    return {
        isBusyTable: false,
        isBusyDetail: {},
        isBusyImage: {},
        items: null,
        itemsVisitDetail: {},
        imageVisitDetail: {},
        imagePutId: null,
        startDate: '',
        finishDate: '',
        headerSimple: this.$store.state.headerSimple,
        headerFile: this.$store.state.headerFile,
        fields:[
            'index',
            // {key:'client', label:'CLIENT'},
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
            "item": this.$route.params.id,
        },
        showImages: false,
        showChangeVisit: false,

      }
    },
    methods: {
       transformGDUrl(url){
            if (!url){
                return url
            }
            let base = 'https://drive.google.com/uc?export=view&id='
            url = url.split('/')
            url = base + url[url.length -2]
            return url
      },

       select(){
         this.isBusyTable = true
         axios
             .get(`${url.visits_only}?visit_after=${this.startDate}&visit_before=${this.finishDate}&client=${this.$route.params.id}`,
                 this.headerSimple)
             .then(response => {this.items = response.data; this.isBusyTable = false;})
             .then(() => this.onUpdate())
             .catch(error => {
                console.log(error);
                this.errored = true;
              })
              .finally(() => (this.loading = false));
       },
       // showDetails(id){
       //     return axios
       //      .get(`${url.visits_only}${id}/`, this.headerSimple)
       //      .then(response => {this.itemsVisitDetail = response.data; this.isBusyDetail = false})
       //      .catch(error => {
       //        console.log(error);
       //        this.errored = true;
       //      })
       //      .finally(() => (this.loading = false));
       //
       // },
       getImage(id){
           return axios
            .get(`${url.visits}${id}/`, this.headerSimple)
            .then(response => {this.imageVisitDetail[id] = response.data; this.isBusyImage[id] = false})
            .catch(error => {
              console.log(error);
              this.errored = true;
            })
            .finally(() => (this.loading = false));
       },
       showImage(func, id, show){
           this.isBusyImage[id] = true
           this.onUpdate()
           this.showImages= true
           this.showChangeVisit = false
           if(show){
               func()
               this.isBusyImage[id] = false
               return
           }
           this.getImage(id).then(() =>  func())
       },
       modalParrametres(src, row, photo, id){
           this.imageDeleteForm.src = src;
           this.imageDeleteForm.row = row;
           this.imageDeleteForm.id_refresh = photo;
           this.imageDeleteForm.id_delete = id;
       },
       showDetails(func, item){
            this.form[item.id] = item
            func()
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
                   .delete(`${url.visits}${id}/`, this.headerSimple)
                   .then(() => row.toggleDetails())
                   .then(() => this.items.splice(row.index, 1))
                   .then(() => this.onUpdate())
               } else {
               alert('Visit is not deleted')
              }
       },
       onSubmit(id, row) {
            this.isBusyDetail[id] = true
            this.onUpdate()
            axios
            .put(`${url.visits}${id}/`, this.form[id], this.headerSimple)
            .then(response => this.applyChange(response.data, row))
            .catch(function(error) {alert('FAILURE!!')})
            .then(() => this.onUpdate())
            .then(() => {row.toggleDetails() ; this.isBusyDetail[id] = false})
        },
       onUpdate() {
          if (this.items.length === 0){
              alert('in this criteria visits not found')
          }
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
                let formData = new FormData();
                formData.append('main_image', this.addImageForm.main_image)
                axios.post(
                    url.imageCreateBase,
                    this.addImageForm,
                    this.headerSimple
                    )
                    .then(response => {
                        this.imagePutId = [response.data.id]
                    })
                    .then(() => {
                            axios.put(
                                `${url.imagePut}${this.imagePutId}/`,
                                formData,
                                this.headerFile
                                )
                                .then(response => {row_item_image.push(response.data)})
                                .then(() => this.onUpdate())
                                .catch(function (error) {alert('FAILURE!!')})
                        })
                    .then(() => alert('your changes are accepted!'))
                    .catch(function (error) {alert('FAILURE!!')})
            }

        },
       imageDelete(imageDeleteForm){
           let itSure = confirm('delete this photo?');
           if (itSure) {
            axios
            .delete(`${url.imagePut}${imageDeleteForm.id_delete}/`,
                this.headerSimple)
            .then(() => imageDeleteForm.row.splice(imageDeleteForm.row.indexOf(imageDeleteForm.id_refresh),1))
            .then(() => this.onUpdate()).then(() => this.$refs.modal.hide())

            }else {
               alert('Images is not deleted')
              }
            }
        },
}
</script>

<style scoped>


</style>