<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">ログイン</div>
      <div class= "right" @click="logout">{{currentUser}}</div>
    </v-ons-toolbar>
    <div><img src="../assets/btn_google_signin_light_normal_web.png" @click="login"></div>
  </v-ons-page>
</template>


<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  computed: mapState(['currentUser']),
  methods: mapActions(['login', 'logout'])
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
