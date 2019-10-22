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
          <b-button pill @click="onSubmit()" variant="success">Submit</b-button>
        </b-form>
        <b-container v-if="itemSplit[0]" fluid class="p-4 bg-dark" >
            <b-row v-for="items in itemSplit">
                <b-col v-for="image in items">
                  <b-img-lazy thumbnail fluid :src='image.main_image' v-b-modal.modal @click.native="imageModal = image" height="250px" width="250px"></b-img-lazy>
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
          <b-modal id="modal" size="xl" ref="modal" centered >
            <b-img :src='imageModal.main_image' width="1000px" height="1000px"></b-img>
            <b-button @click="onDelete(imageModal)" variant="danger">DELETE</b-button>
          </b-modal>
        </div>
   </div>


</template>



<script>
import axios from 'axios'
import BACKEND_PATH from './const'

    export default {
        data() {
            return {
                startDate: (new Date()).toISOString().slice(0,10),
                finishDate: (new Date()).toISOString().slice(0,10),
                items: null,
                itemSplit: [],
                imageModal: '',
                urlImageDelete: BACKEND_PATH + 'image_create/',
                headerSimple: this.$store.state.headerSimple,
                headerFile: this.$store.state.headerFile,
            }
        },
        methods: {
            onDelete(imageModal){
                {
               let itSure = confirm(imageModal.id)
               if (itSure) {
                    axios
                    .delete((this.urlImageDelete + imageModal.id + '/'), this.headerSimple)
                    .then(() => this.items.splice(this.items.indexOf(imageModal),1))
                    .then(() => this.onSubmit())
                    .then(() => this.$refs.modal.hide())
            }else {
               alert('Images is not deleted')
              }
            }
            },
            splitItems(){
                this.itemSplit = []
                let scratch = []
                let count = 0
                let listImage = []
                for(let visit of this.items){
                    for(let image of visit.image){
                        listImage.push(image)
                    }
                }
                for (let item of listImage){
                    count++
                    scratch.push(item);
                    if(count === 7 || (listImage.indexOf(item)+1) === listImage.length  ){
                        this.itemSplit.push(scratch);
                        scratch = []
                        count = 0
                    }

                }
            },
            onSubmit(){
                axios
                .get(BACKEND_PATH + `visits/?client=${this.$route.params.id}&format=json&visit_after=${this.startDate}&visit_before=${this.finishDate}`,
                this.headerSimple)
                .then(response => {
                    this.items = response.data; this.splitItems();
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));

            }
        },
    }
</script>

<style scoped>

</style>