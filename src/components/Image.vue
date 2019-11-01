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
            <b-button pill @click="onSubmit()" variant="success">Submit</b-button>
        </b-form>
        <b-container v-if="showImages" fluid class="p-4 bg-dark">
            <b-spinner v-if="isBusy" variant="primary" label="Text Centered"></b-spinner>
            <b-row v-for="items in imageSplitList">
                <b-col v-for="image in items">
                    <b-img-lazy thumbnail fluid :src='transformGDUrl(image.main_image)' v-b-modal.modal
                                @click.native="imageModal = image" height="150px" width="150px"></b-img-lazy>
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
            <b-modal id="modal" size="xl" ref="modal" centered hide-footer
                     header-bg-variant="dark"
                     header-text-variant="light"
            >
                <template v-slot:modal-title>
                    <a>{{getClientImage(imageModal)}}</a> date visit <a>{{getDateVisit(imageModal)}}</a>
                </template>
                <b-spinner v-if="isBusyImageDelete"></b-spinner>
                <b-img v-if="!isBusyImageDelete" :src='transformGDUrl(imageModal.main_image)' width="1000px"
                       height="700px"></b-img>
                <b-button :disabled="isBusyImageDelete" @click="onDelete(imageModal)" variant="danger">DELETE</b-button>
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
                client: '',
                optionsClientName: [],
                startDate: (new Date()).toISOString().slice(0, 10),
                finishDate: (new Date()).toISOString().slice(0, 10),
                items: null,
                itemSplit: [],
                imageModal: '',
                headerSimple: this.$store.state.headerSimple,
                headerFile: this.$store.state.headerFile,
                showImages: false,
                isBusyImageDelete: false,
                imageSplitList: [],
                listImage: [],
            }
        },
        mounted() {
            axios
                .get(url.client_without_photo, this.headerSimple)
                .then(response => this.getClient(response.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        },
        methods: {
            transformGDUrl(url) {
                if (!url || typeof url === "object") {
                    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ5uJWcIo66YAkOSsr8hbrUViRwZtaWsNXsLge9DsbYYJv7Kdbs'
                }
                let base = 'https://drive.google.com/uc?export=view&id='
                url = url.split('/')
                url = base + url[url.length - 2]
                return url
            },
            onDelete(imageModal) {
                {
                    let itSure = confirm('delete this photo?')
                    if (itSure) {
                        this.isBusyImageDelete = true
                        axios
                            .delete(`${url.imageCreateBase}${imageModal.id}/`, this.headerSimple)
                            .then(() => this.listImage.splice(this.listImage.indexOf(imageModal), 1))
                            .then(() => this.splitImageList() | this.$refs.modal.hide() | (this.isBusyImageDelete = false))
                            .then(() => alert('image delete successful'))
                            .catch(function (error) {
                                console.log(error);
                                alert('FAILURE!!')
                            })
                    } else {
                        alert('Images is not deleted')
                    }
                }
            },
            getDateVisit(modalImage) {
                for (let visit of this.items) {
                    for (let image of visit.image) {
                        if (modalImage === image) {
                            return visit.date_visit
                        }
                    }
                }
            },
            getClientImage(modalImage) {
                for (let client of this.optionsClientName) {
                    if (modalImage.client === client.value) {
                        return client.text
                    }
                }
            },
            getImageList() {
                if (!this.items[0]) {
                    this.isBusy = false
                    this.showImages = false
                    alert('visits not found')
                    return
                }
                this.listImage = []
                for (let visit of this.items) {
                    for (let image of visit.image) {
                        this.listImage.push(image)
                    }
                }
            },
            splitImageList() {
                this.imageSplitList = []
                let scratch = []
                let count = 0
                for (let item of this.listImage) {
                    count++
                    scratch.push(item);
                    if (count === 5 || (this.listImage.indexOf(item) + 1) === this.listImage.length) {
                        this.imageSplitList.push(scratch);
                        scratch = []
                        count = 0
                    }
                }
                this.isBusy = false
                if (!this.imageSplitList[0]) {
                    this.showImages = false
                    alert('image not found')
                }
            },
            onSubmit() {
                this.isBusy = true
                this.showImages = true
                axios
                    .get(`${url.visits}?client=${this.client}&format=json&visit_after=${this.startDate}&visit_before=${this.finishDate}`,
                        this.headerSimple)
                    .then(response => {
                        this.items = response.data;
                        this.getImageList();
                        this.splitImageList();
                        this.isBusy = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            },
            getClient(listClients) {
                for (let item of listClients) {
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