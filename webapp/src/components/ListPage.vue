<template>
  <v-ons-page @show="shown($event)">
    <v-ons-toolbar>

      <div class="title">
        <div class="left">セントケア&emsp;ケアログ</div>
        <div class="right text-blue">
          <span @click="print" style="margin-right:2rem;">帳票</span>
          <span @click="logout">☒</span>
        </div>
      </div>

      <div>
        <div class="data-select">
          <div class="info">
            <div class="detail">
              <div class="arrow-left" @click="dayPrev"></div>
              <div class="data text-white" v-if="daysAgo==0">今日<br/>{{dateMonth}}/{{dateDate}}</div>
              <div class="data text-white" v-else>{{daysAgo}}日前<br/>{{dateMonth}}/{{dateDate}}</div>
              <div class="arrow-right" @click="dayNext"></div>
            </div>
          </div>
          <div class="info">
            <div class="detail">
              <span class="caption text-orange" v-if="orderArrays != null && orderKey == 'user'">担当者</span>
              <span class="caption text-blue"   v-if="orderArrays != null && orderKey == 'patient'">お客様</span>
              <v-ons-select modifier="material" v-if="orderArrays != null"
                :value="selectedOrder"
                @input="updateOrder($event.target.value)">
                <option v-for="o in orderArrays"
                  :key="o.name" :value="o['.key']">
                  {{o.name}}
                </option>
              </v-ons-select>
            </div>
          </div>
        </div>
      </div>

    </v-ons-toolbar>

    <v-ons-list modifier="noborder">
      <v-ons-list-item tappable
        v-for="item in memos"
        :key="item['.key']"
        @click="tapped(item)" modifier="nodivider">
        <v-ons-row>
          <v-ons-col width="2.5rem" style="position:relative;">
            <div class="patient-name text-bright-blue">
              {{patientsObject[item.patient_id].name}}
            </div>
          </v-ons-col>
          <v-ons-col>
            <v-ons-row>
              <v-ons-col width="4rem">
                <div>{{ts2tm(item.timestamp_evented)}}</div>
              </v-ons-col>
              <v-ons-col>
                <div>{{item.title}}</div>
              </v-ons-col>
              <v-ons-col width="5rem" class="face-status-box">
                <span class="face-status" v-if="item.face_confusion">混</span>
                <span class="face-status" v-if="item.face_dependence">依</span>
                <span class="face-status" v-if="item.face_daydream">夢</span>
              </v-ons-col>
            </v-ons-row>
            <v-ons-row>
              <div>{{item.event_care}}</div>
            </v-ons-row>
          </v-ons-col>
          <v-ons-col width="2.5rem" style="position:relative;">
            <div class="user-name text-bright-orange">
              {{usersObject[item.user_id].name}}
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
    daysAgo () {
      console.log('daysAgo: ' + this.selectedPeriod);
      return parseInt(this.selectedPeriod.slice(0, -1), 10);
    },
    dateYear () {
      return new Date(Date.now() - this.daysAgo*24*60*60*1000).getFullYear();
    },
    dateMonth () {
      return new Date(Date.now() - this.daysAgo*24*60*60*1000).getMonth() + 1;
    },
    dateDate () {
      return new Date(Date.now() - this.daysAgo*24*60*60*1000).getDate();
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
  created () {
    console.log('ListPage: created.');
    this.selectedPeriod = this.selectedPeriod;
    switch (this.orderKey) {
      case 'user':
        this.selectedOrder = 'u0';
        break;
      case 'patient':
        this.selectedOrder = 'p0';
        break;
      default:
        this.selectedOrder = '';
        break;
    }
    console.log('orderKey: ' + this.orderKey);
    console.log('selectedOrder: ' + this.selectedOrder);
  },
  methods: {
    ts2dt (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    },
    ts2tm (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleTimeString().slice(0, -3);
    },
    dayNext () {
      var d = this.daysAgo;
      if (d > 0) {
        d -= 1;
      }
      this.selectedPeriod = d + 'd';
    },
    dayPrev () {
      var d = this.daysAgo;
      if (d < 7) {
        d += 1;
      }
      this.selectedPeriod = d + 'd';
    },
    tapped (item) {
      this.pushPage( {extends:EditPage, data() { return {item:item}}} );
    },
    print () {
      window.open('https://carememo1print.firebaseapp.com/?'
        + 'd=' + this.daysAgo);
    },
    shown (event) {
      console.log("shown by: ", this.orderKey, " period: ", this.selectedPeriod);
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
  /* 文字色変更用 */
  .text-bright-orange {
      color: #ff3300 !important;
  }
  .text-bright-blue {
      color: #0000ff !important;
  }
  .text-orange {
      color: #ffa500 !important;
  }
  .text-blue {
      color: #81BEF7 !important;
  }
  .text-yellow {
      color: #FFFF00 !important;
  }
  /* ツールバー部分 */
  .toolbar {
      flex-direction: column;
  }
  /* タイトル部分 */
  .title {
      padding: 8px;
      height: 41px;
      /* Workaround for Galaxy S5 view of Chrome developer tool */
      display: -webkit-box;
      /*
      display: -webkit-flex;
      display: flex;
      */
      justify-content: space-between;
      /* Workaround for Android real devices */
      -webkit-justify-content: space-between;
      -webkit-box-pack: justify;
      align-items: center;
      box-sizing: border-box; /* Workaround for Galaxy S5 view of Chrome developer tool */
  }
  /* 期間と名前の選択部分 */
  .data-select {
      width: 100%;
      height: 50px;
      background-color: #424242;
      display: table;
  }
  .data-select .info {
      width: 50%;
      padding: 4px;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
  }
  .data-select .detail {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  /* 期間選択の部分 */
  .data-select .data {
      padding: 0 4px;
      width: 70%;
      height: 42px; /* Workaround for Galaxy S5 view of Chrome developer tool */
  }
  .arrow-left {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 17px 20px 17px 0;
      border-color: transparent #ffffff transparent transparent;
  }
  .arrow-right {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 17px 0 17px 20px;
      border-color: transparent transparent transparent #ffffff;
  }
  /* 名前選択の部分 */
  .data-select .caption {
      padding: 0 8px;
  }
  .user-name {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
  }
  .patient-name {
      position: absolute;
      top:50%;
      transform:translateY(-50%);
      -webkit-transform:translateY(-50%);
  }
  .face-status-box {
      text-align: right;
      padding: 0 0.7rem 0 0;
  }
  .face-status {
      padding: 0 0 0 0.2rem;
  }
</style>