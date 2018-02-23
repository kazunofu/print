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
    <v-ons-list>
      <v-ons-list-header>Default</v-ons-list-header>
      <v-ons-list-item modifier="nodivider">
        <div class="left">タイトル</div>
        <label class="center">
          <v-ons-input float placeholder="タイトル" modifier="underbar"
            v-model="item.title"/>
        </label>
      </v-ons-list-item>
      <v-ons-list-item modifier="nodivider">
        <div class="left">日時</div>
        <div class="center">{{ts2dt(item.timestamp_evented)}}</div>
      </v-ons-list-item>
      <v-ons-list-item modifier="nodivider">
        <div class="left">
          <v-ons-icon icon="fa-user" size="2x" style="vertical-align: middle;"/>
        </div>
        <div class="center">{{item.user_id}}</div>
      </v-ons-list-item>
      <v-ons-list-item modifier="nodivider">
        <div class="left">
          <v-ons-icon icon="fa-user" size="2x" style="vertical-align: middle;"/>
        </div>
        <div class="center">{{item.patient_id}}</div>
      </v-ons-list-item>
    </v-ons-list>
    <v-ons-list modifier="inset">
      <v-ons-list-header>表情</v-ons-list-header>
      <v-ons-list-item>
        <div class="left">
          <v-ons-icon icon="fa-heart" class="list-item__icon" style="color:red;"/>
        </div>
        <div class="center">混乱期</div>
        <div class="right"><v-ons-switch v-model="item.face_confusion"/></div>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="left">
          <v-ons-icon icon="fa-heart" class="list-item__icon" style="color:purple;"/>
        </div>
        <div class="center">依存期</div>
        <div class="right"><v-ons-switch v-model="item.face_dependence"/></div>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="left">
          <v-ons-icon icon="fa-heart" class="list-item__icon" style="color:orange;"/>
        </div>
        <div class="center">昼夢期</div>
        <div class="right"><v-ons-switch v-model="item.face_daydream"/></div>
      </v-ons-list-item>
    </v-ons-list>
    <v-ons-list>
      <v-ons-list-item>
        <span class="list-item__title">観察内容・ケア内容</span>
        <textarea class="textarea" placeholder="観察内容・ケア内容" style="width:100%;"
          v-model="item.event_care"></textarea>
      </v-ons-list-item>
      <v-ons-list-item>
        <span class="list-item__title">笑顔</span>
        <textarea class="textarea" placeholder="笑顔" style="width:100%;"
          v-model="item.event_smile"></textarea>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>


<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'EditPage',
  computed: mapState(['currentUser']),
  methods: {
    ts2dt (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    },
    ...mapActions(['logout', 'updateMemo'])
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
