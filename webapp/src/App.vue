<template>
  <v-ons-navigator swipeable :page-stack="pages">
  </v-ons-navigator>
</template>


<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: mapState(['pages'])
}
</script>


<style>
</style>
