<template>
  <div>
     <div>
         <b-table :items="itemsCalendar"  :fields="fieldsTable"  ref="table" bordered hover fixed >
             <template  v-slot:cell()="data">
                 <b @click="showModal(data.value)">{{viewData(data.value).date}}</b>
                 <p @click="showModal(data.value)">_______________</p>
                 <p @click="showModal(data.value)" v-for="client in viewData(data.value).client">{{client}}</p>
             </template>
         </b-table>
     </div>


  <div>
    <b-modal id="modal" ref="modal" centered ok-only>
         <b-table :items="itemsDayList" dark bordered hover fixed no-body>
            <template v-slot:cell(Client)="data">
                <b-card v-if="data.value" overlay img-src="https://picsum.photos/900/250/?image=3"  >{{data.value}}</b-card>
            </template>
         </b-table>
         <b-button variant="success" pill v-b-modal.modalPushForm >New event</b-button>
    </b-modal>

    <b-modal id="modalPushForm" ref="modalPushForm" ok-only centered>
        <b-form>
          <b-form-group label="Date:">
              <b-form-input type="date" :min="startDate" :max="finishDate" v-model="startDay"></b-form-input>
          </b-form-group>
           <b-form-group label="Time:">
              <b-form-input type="time" min="08:00" max="18:00" v-model="startTime"></b-form-input>
          </b-form-group>
          <b-form-group label="Description">
              <b-form-input v-model="formEvent.description"></b-form-input>
          </b-form-group>
          <b-form-group label="what you need">
              <b-form-input v-model="formEvent.summary"></b-form-input>
          </b-form-group>
          <b-form-group label="your email">
              <b-form-input v-model="formEvent.attendees"></b-form-input>
          </b-form-group>
          <b-button variant="success" pill @click="createEvent" >Event</b-button>
        </b-form>
    </b-modal>
      <iframe src="https://calendar.google.com/calendar/embed?src=3heg1bu3gvoqmplmp5kpqn56ic%40group.calendar.google.com&ctz=America%2FLos_Angeles" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>


    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            items: null,
            value: null,
            startDay: '',
            startTime: '',
            get: new Date(),
            startDate: (new Date()).toISOString().slice(0,10),
            finishDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0,10),
            itemsCalendar: [],
            fieldsTable: [
                {key:'date0', label: 'Sunday'},
                {key:'date1', label: 'Monday'},
                {key:'date2', label: 'Tuesday'},
                {key: 'date3', label: 'Wednesday'},
                {key: 'date4', label: 'Thursday'},
                {key: 'date5', label: 'Friday'},
                {key: 'date6', label: 'Saturday'},
            ],
            fieldsDay: [{key:'Time', label: 'Time'}],
            fieldsDayClient: [{key:'Client', label: 'Client'}],
            itemsDayList: [],

            formEvent: {
                "status": "",
                "htmlLink": "",
                "creator": "",
                "start": "",
                "end": "",
                "description": "",
                "summary": "",
                "attendees": "",
            },
            fields:[
                {key:'start', label: 'date start'},
                {key:'end', label: 'date end'},
                {key:'description', label: 'description'},
                {key: 'summary', label: 'title'},
                {key: 'attendees', label: 'client'}
            ],
            urlCalendar: 'http://127.0.0.1:8000/calendar/',
        };
    },
    methods: {
        viewData(data){
            let new_data = {}
            new_data['date'] = data.slice(0,6)
            new_data['client'] = data.slice(6,).split('/')
            return new_data
        },
        showModal(value){
            this.itemsDayDefault()
            value = value.slice(6,).split('/')
            for (let time of value){
                for (let timeDefault in this.itemsDayList){
                    if( this.itemsDayList[timeDefault].Time === time.slice(0,5)){
                        this.itemsDayList[timeDefault].Client = time.slice(8,)
                    }
                }

            }
            this.$refs['modal'].show()
        },
        createEvent(){
            this.formEvent.start = this.startDay + 'T' + this.startTime + ':00'
            axios
                .post(this.urlCalendar, this.formEvent, {
                    headers: {"Content-Type": 'application/json', 'Accept': 'application/json'}
                    })

        },
        bindGoogleCalendar(value){
            let time_event = ""
            for (let eventGoogle of this.items){
                   if(eventGoogle.start.slice(0,10) === value.toISOString().slice(0,10)){
                       time_event += eventGoogle.start.slice(11,16) + ' - ' + eventGoogle.description + '/'

                }
               }
            value = value.toString().slice(4,10) + time_event
            return value
        },
        itemsDayDefault(){
            this.itemsDayList = [
                {Time: '08:00', Client: ''},
                {Time: '09:00', Client: ''},
                {Time: '10:00', Client: ''},
                {Time: '11:00', Client: ''},
                {Time: '12:00', Client: ''},
                {Time: '13:00', Client: ''},
                {Time: '14:00', Client: ''},
                {Time: '15:00', Client: ''},
                {Time: '16:00', Client: ''},
                {Time: '17:00', Client: ''},
                {Time: '18:00', Client: ''},
                {Time: '19:00', Client: ''},]
        },
        getItemsCalendar(){
            let date = this.get.getDay()
            let pre_date = this.get.getDay()
            let count = 0
            let item = {}
            while (pre_date > 0){
                item['date' + (date.toString()-pre_date)] = new Date(new Date().setDate(new Date().getDate() - pre_date)).toString().slice(4,10)
                pre_date --
            }
            while ((count - (6 - this.get.getDay()) ) < 22){

                item['date' + date.toString()] = new Date(new Date().setDate(new Date().getDate() + count))
                item['date' + date.toString()] = this.bindGoogleCalendar(item['date' + date.toString()])
                count ++
                date ++
                if (date === 7){
                    date = 0
                    item['_cellVariants'] = {date0:'danger', date6:'danger', date1:'info', date2:'info',
                        date3:'info', date4:'info', date5:'info'}
                    this.itemsCalendar.push(item)
                    item = {}
                }

            }
        }

    },
    mounted() {
    axios.get(this.urlCalendar)
      .then(response => (this.items = response.data))
      .then(() => this.getItemsCalendar());
  }
}
</script>

<style scoped>

</style>