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
          { //icon: 'fa-users',
            label: '全て',
            page: ListPage,
            props: {
              orderKey: 'any' }, },
          { //icon: 'fa-user-md',
            label: '記入者別',
            page: ListPage,
            props: {
              orderKey: 'user' }, },
          { //icon: 'fa-user',
            label: 'お客様別',
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
