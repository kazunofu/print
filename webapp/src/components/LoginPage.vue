<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left"><span class="pdg-m">セントケア&emsp;ケアログ&emsp;ログイン</span></div>
    </v-ons-toolbar>
    <div class="login-btn"><img src="../assets/btn_google_signin_light_normal_web.png" @click="login"></div>
  </v-ons-page>
</template>


<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  methods: mapActions(['login'])
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* ツールバー部分 */
  .pdg-m {
      padding: 0 8px;
  }
  /* ボタン部分 */
  .login-btn { 
      padding: 20px 0;
      text-align: center; 
  }
</style>
