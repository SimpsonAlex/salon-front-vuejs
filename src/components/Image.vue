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
                    <option value="" >-- not use filter client --</option>
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
          <b-button pill @click="onSubmit()" variant="success">Submit</b-button>
        </b-form>
        <b-container v-if="isBusy" fluid class="p-4 bg-dark" >
            <b-spinner v-if="!itemSplit[0]" variant="primary" label="Text Centered"></b-spinner>
            <b-row v-for="items in itemSplit">
                <b-col v-for="image in items">
                  <b-img-lazy thumbnail fluid :src="transformGDUrl(image.main_image)" v-b-modal.modal @click.native="imageModal = image" height="200px" width="200px"></b-img-lazy>
                </b-col>
            </b-row>
        </b-container>
        <b-container v-else>

              <b-carousel
                id="carousel-no-animation"
                style="text-shadow: 0px 0px 2px #000"
                no-animation
                indicators
                img-width="1024"
                img-height="480"
              >
                <b-carousel-slide
                  caption="First slide"
                  img-src="https://picsum.photos/1024/480/?image=10"
                ></b-carousel-slide>
                <b-carousel-slide
                  caption="Second Slide"
                  img-src="https://picsum.photos/1024/480/?image=12"
                ></b-carousel-slide>
                <b-carousel-slide
                  caption="Third Slide"
                  img-src="https://picsum.photos/1024/480/?image=22"
                ></b-carousel-slide>
                <b-carousel-slide
                  caption="Fourth Slide"
                  img-src="https://picsum.photos/1024/480/?image=23"
                ></b-carousel-slide>
             </b-carousel>
        </b-container>
        <div>
          <b-modal id="modal" size="xl" ref="modal" centered ok-only>
            <b-img :src='transformGDUrl(imageModal.main_image)' width="1000px" height="1000px"></b-img>
            <b-button @click="onDelete(imageModal)" variant="danger">DELETE</b-button>
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
            isBusy: false,
            client:'',
            optionsClientName: [],
            startDate: (new Date()).toISOString().slice(0,10),
            finishDate: (new Date()).toISOString().slice(0,10),
            items: null,
            itemSplit: [],
            imageModal: '',
            headerSimple: this.$store.state.headerSimple,
            headerFile: this.$store.state.headerFile,
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
        onDelete(imageModal) {
            {
                let itSure = confirm(imageModal)
                if (itSure) {
                    axios
                        .delete(`${this.url.imageCreateBase}${imageModal.id}/`, this.headerFile)
                        .then(() => this.items.splice(this.items.indexOf(imageModal), 1))
                        .then(() => this.itemSplit = [])
                        .then(() => this.splitItems())
                        .then(() => this.$refs.modal.hide())
                } else {
                    alert('Images is not deleted')
                }
            }
        },
        splitItems() {
            if (!this.items[0]){
                this.isBusy = false
                alert('image not found')
                return
            }
            this.itemSplit = [];
            let scratch = [];
            let count = 0;
            let listImage = [];
            for (let visit of this.items) {
                for (let image of visit.image) {
                    listImage.push(image)
                }
            }
            for (let item of listImage) {
                count++
                scratch.push(item);
                if (count === 7 || (listImage.indexOf(item) + 1) === listImage.length) {
                    this.itemSplit.push(scratch);
                    scratch = [];
                    count = 0
                }
            }
            if(!this.itemSplit[0]){
                this.isBusy = false
                alert('image not found')
            }
        },
        onSubmit() {
            this.isBusy = true
            axios
                .get(`${url.visits}?client=${this.client}&format=json&visit_after=${this.startDate}&visit_before=${this.finishDate}`,
                    this.headerSimple)
                .then(response => {
                    this.items = response.data;
                    this.splitItems();
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));

        },
        getClient() {
            for (let item of this.items) {
                let clientData = {};
                clientData.text = item.first_name + ' ' + item.last_name;
                clientData.value = item.id;
                this.optionsClientName.push(clientData)

            }
        }
    },
}
</script>

<style scoped>

</style>