<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">編集</div>
      <div class="right">
          <v-ons-toolbar-button @click="updateMemo(item)">保存</v-ons-toolbar-button>
          <v-ons-toolbar-button @click="logout">{{currentUser}}</v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <textarea class="textarea" placeholder="default text" rows="5" style="width:100%;"
      v-model="item.event_care"></textarea>
  </v-ons-page>
</template>


<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'EditPage',
  computed: mapState(['currentUser']),
  methods: mapActions(['logout', 'updateMemo'])
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
