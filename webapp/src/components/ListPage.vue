<template>
  <v-ons-page @show="shown($event)">
    <v-ons-toolbar>
      <div class="center">介護メモ
        <v-ons-select modifier="underbar" v-if="orderArrays != null"
          :value="selectedOrder"
          @input="updateOrder($event.target.value)">
          <option value=''>全員</option>
          <option v-for="o in orderArrays"
            :key="o.name" :value="o['.key']">
            {{o.name}}
          </option>
        </v-ons-select>
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="popPeriod = true">
          <v-ons-icon icon="fa-clock-o" size="lg" id="button-period"/>
        </v-ons-toolbar-button>
        <v-ons-toolbar-button @click="print">印刷</v-ons-toolbar-button>
        <v-ons-toolbar-button @click="logout">{{currentUser}}</v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <v-ons-list>
      <v-ons-list-item tappable
        v-for="item in memos"
        :key="item['.key']"
        @click="tapped(item)">
        <v-ons-row>
          <v-ons-col width="2.5rem" style="position:relative;">
            <div style="position:absolute; top:50%; transform:translateY(-50%); -webkit-transform:translateY(-50%);">
              {{usersObject[item.user_id].name}}<v-ons-icon icon="fa-user-md" size="2x" style="vertical-align: middle;"></v-ons-icon>
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
              {{patientsObject[item.patient_id].name}}<v-ons-icon icon="fa-user" size="2x" style="vertical-align: middle;"></v-ons-icon>
            </div>
          </v-ons-col>
        </v-ons-row>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-popover cancelable direction="down" cover-target
      target="#button-period"
      :visible.sync="popPeriod">
      <v-ons-list>
        <v-ons-list-item v-for="(p, $i) in periods" :key="$i"
          tappable
          :modifier="($i === periods.length - 1) ? 'longdivider' : ''">
          <label class="left">
            <v-ons-radio
              :input-id="'radio-' + $i"
              :value="p.value"
              v-model="selectedPeriod">
            </v-ons-radio>
          </label>
          <label :for="'radio-' + $i" class="center">
            {{ p.label }}
          </label>
        </v-ons-list-item>
      </v-ons-list>
    </v-ons-popover>

  </v-ons-page>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import EditPage from './EditPage'
import PrintPage from './PrintPage'
import { periods } from '../config'

export default {
  name: 'ListPage',
  props: ['orderKey'],
  data () {
    return {
      periods: periods,
      popPeriod: false,
      selectedOrder: '' };
  },
  computed: {
    selectedPeriod: {
      get () { return this.periodBy; },
      set (value) { this.updatePeriod(value); }
    },
    orderArrays () {
      switch (this.orderKey) {
        case 'user':
          return this.usersArrays;
        case 'patient':
          return this.patientsArrays;
        default:
          return null;
      }
    },
    ...mapState([
      'currentUser',
      'memos',
      'usersObject',
      'usersArrays',
      'patientsObject',
      'patientsArrays',
      'periodBy',
     ])
  },
  methods: {
    ts2dt (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    },
    tapped (item) {
      this.pushPage( {extends:EditPage, data() { return {item:item}}} );
    },
    print () {
      this.pushPage(PrintPage);
    },
    shown (event) {
      console.log("shown", this.orderKey);
      this.updateOrder(this.selectedOrder);
    },
    updateOrder (value) {
      console.log("updateOrder:", value);
      this.selectedOrder = value;
      switch (this.orderKey) {
        case 'user':
          this.updateOrderUser(value);
          break;
        case 'patient':
          this.updateOrderPatient(value);
          break;
        default:
          this.updateOrderUser('');
          break;
      }
    },
    ...mapMutations(['pushPage']),
    ...mapActions([
      'logout',
      'updatePeriod',
      'updateOrderUser',
      'updateOrderPatient',
    ]),
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toolbar__center .select {
  line-height: 32px;
  margin-left: 5%;
}
</style>
