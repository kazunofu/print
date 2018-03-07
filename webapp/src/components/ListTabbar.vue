<template>
  <v-ons-page>
    <v-ons-tabbar swipeable position="bottom"
      :tabs="tabs">
    </v-ons-tabbar>
  </v-ons-page>
</template>


<script>
import ListPage from './ListPage'

export default {
  name: 'ListTabbar',
  data () {
    return {
      tabs: [
          { icon: 'fa-users',
            label: '全員',
            page: ListPage,
            props: {
              orderKey: 'any' }, },
          { icon: 'fa-user-md',
            label: '職員',
            page: ListPage,
            props: {
              orderKey: 'user' }, },
          { icon: 'fa-user',
            label: '患者',
            page: ListPage,
            props: {
              orderKey: 'patient' }, },
        ] };
  },
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
