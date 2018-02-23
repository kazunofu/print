<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">介護メモ</div>
      <div class="right" @click="logout">{{currentUser}}</div>
    </v-ons-toolbar>
    <v-ons-list>
      <v-ons-list-header>Default</v-ons-list-header>
      <v-ons-list-item tappable
        v-for="item in memos"
        :key="item['.key']"
        @click="tapped(item)">
        <v-ons-row>
          <v-ons-col width="2.5rem" style="position:relative;">
            <div style="position:absolute; top:50%; transform:translateY(-50%); -webkit-transform:translateY(-50%);">
              {{item.user_id}}<v-ons-icon icon="fa-user" size="2x" style="vertical-align: middle;"></v-ons-icon>
            </div>
          </v-ons-col>
          <v-ons-col>
            <v-ons-row>
              <v-ons-col>
                <div>{{item.title}}</div>
              </v-ons-col>
              <v-ons-col width="10rem">
                <div>{{ts2dt(item.timestamp_evented)}}</div>
              </v-ons-col>
              <v-ons-col width="8rem">
                <v-ons-icon icon="fa-heart" class="list-item__icon right" style="color:red;" v-if="item.face_confusion"></v-ons-icon>
                <v-ons-icon icon="fa-heart" class="list-item__icon right" style="color:purple;" v-if="item.face_dependence"></v-ons-icon>
                <v-ons-icon icon="fa-heart" class="list-item__icon right" style="color:orange" v-if="item.face_daydream"></v-ons-icon>
              </v-ons-col>
            </v-ons-row>
            <v-ons-row>
              <div>{{item.event_care}}</div>
            </v-ons-row>
          </v-ons-col>
          <v-ons-col width="2.5rem" style="position:relative;">
            <div style="position:absolute; top:50%; transform:translateY(-50%); -webkit-transform:translateY(-50%);">
              {{item.patient_id}}<v-ons-icon icon="fa-user" size="2x" style="vertical-align: middle;"></v-ons-icon>
            </div>
          </v-ons-col>
        </v-ons-row>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import EditPage from './EditPage'

export default {
  name: 'ListPage',
  computed: {
    ...mapState(['currentUser', 'memos'])
  },
  methods: {
    ts2dt (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    },
    tapped (item) {
      this.pushPage( {extends:EditPage, data() { return {item:item}}} );
    },
    ...mapMutations(['pushPage']),
    ...mapActions(['logout'])
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
