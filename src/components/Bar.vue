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

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      show-empty
      striped
      hover
      stacked="md"
      :items="items"
      :fields="fields"
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
        <b-button pill variant="outline-primary" :href="'#/client/' + row.item.id">Detail</b-button>
      </template>

    </b-table>

  </b-container>

</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {

      items: null,
      fields: [
          'index',
        { key: ('first_name'), label: 'Person first name', sortable: true, sortDirection: 'desc' },
        { key: 'last_name', label: 'Person last name', sortable: true, class: 'text-center' },
        {
          key: 'active',
          label: 'is Active',
          formatter: (value) => {
            return value ? 'Yes' : 'No'
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true
        },
        {key: 'foto', label: 'Photo', sortable: false},
        {key: 'url', label: 'Detail', sortable: false}
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 20, 30],
      filter: null,
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
    .catch(error => {
      console.log(error);
      this.errored = true;
    })
    .finally(() => (this.loading = false));
},
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>