<template>
  <div>
      <b-img right src="https://picsum.photos/id/237/536/354" alt="Right image"></b-img>
      <b-table sticky-header :items="items" head-variant="light"></b-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            items: null
        };
    },
    mounted() {
    axios.get('http://127.0.0.1:8000/listclients/?format=json')
      .then(response => (this.items = response.data));
  }
}
</script>