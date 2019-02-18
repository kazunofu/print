<template>
  <div class="body">
    <div class="head noprint">
      <div class="titlebar">
        <div class="info text-white">
          <div class="title">セントケア&emsp;ケアログ&emsp;帳票</div>
        </div>
        <div class="info text-blue">
          <div class="email" v-if="currentUser != 'anonymous'">
            <span @click="print" class="print-button">印刷</span>
            <span @click="logout">☒</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentUser == 'anonymous'" class="noprint login-btn">
      <img src="../assets/btn_google_signin_light_normal_web.png" @click="login">
    </div>
    <div v-else >
      <div class="head">
        <div class="data-select noprint">
            <div class="detail">
              <div class="left text-white">　始日時：</div>
              <div class="center">
                <input style="font-size: 16px"
                  type="date"
                  v-model="start_day_computed">
              </div>
              <div class="left text-white">　終日時：</div>
              <div class="center">
                <input style="font-size: 16px"
                  type="date"
                  v-model="end_day_computed">
              </div>
              <label class="text-white"  for="checkbox">匿名</label>
              <input type="checkbox" id="checkbox" v-model="flg_fuse">
              <span class="caption text-orange">お客様</span>
              <select
                :value="selectedOrder"
                @input="updateOrder($event.target.value)">
                <option value=''>全て</option>
                <option v-for="o in orderArrays"
                  :key="o.name" :value="o['.key']">
                  {{o.name}}
                </option>
              </select>
            </div>
        </div>
      </div>

      <article
        v-for="p in patientsArrays" :key="p.name" v-if="selectedOrder == '' || selectedOrder == p['.key']"
        class="page-break">
        <div class="table-box">
          <div class="box">
              <div class="right date">{{start_day_computed2}}<br>〜{{end_day_computed2}}</div>
              <div class="ttl">< 介護看護記録 ></div>
          </div>
          <div class="box">
              <div class="right"><img src="../assets/logo.png" alt=""></div>
              <div class="name-box">
                  <div class="box-title">お客様名:</div>
                  <div class="name" v-if="flg_fuse">{{p.name_fuse}}</div>
                  <div class="name" v-else>{{p.name}}</div>
                  <div class="honorific">様</div>
              </div>
          </div>
          <table>
            <thead>
            <tr>
              <th class="solid3-left">日付</th>
              <th>時間</th>
              <th>項目</th>
              <th>記録</th>
              <th>記録者</th>
              <th>申し送り</th>
            </tr></thead>
            <tbody>

              <!-- <tr v-for="m in memos | filterBy p['.key'] in patient_id" :key="m['.key']" -->
              <!-- <tr v-for="m in filteredMemos(p)" :key="m['.key']" -->
              <tr v-for="m in memos" :key="m['.key']" v-if="m.patient_id == p['.key']"
              v-bind:class="{'td-red': isNight(m.timestamp_evented),'td-blue': isNurse(m.user_id)}">
                <!-- <td><span>{{getTdDate(p['.key'], m.timestamp_evented)}}</span></td> -->
                <td><span>{{ts2dt(m.timestamp_evented)}}</span></td>
                <td><span>{{ts2tm(m.timestamp_evented)}}</span></td>
                <td><span>{{m.title}}</span></td>
                <td><span>{{m.event_care}}</span></td>
                <td><span>{{usersObject[m.user_id].name}}</span></td>
                <td>{{m.face_confusion ? '✔' : '&nbsp;'}}</td>
              </tr>
            </tbody>
          </table>
          <div class="revision">セントケア・グループ&nbsp;2018.05Web改訂</div>
        </div>
　　  </article>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'PrintPage',
  data () {
    return {
      daysAgo: 0,
      selectedOrder: '',
      flg_fuse: false,
      tmp_patient: ''
    }
  },
  
  computed: {
    filteredMemos: () => (pid) => {
      this.findby(pid)
    },
    // タイムスタンプから日時を計算
    start_day_computed: {
      get () { return this.calcDate(1, this.periodStart) },
      set (value) { this.updatePeriodStart(Date.parse(value)) }
    },
    start_day_computed2 () {
        return this.calcDate(2, this.periodStart)
    },
    // タイムスタンプから日時を計算
    end_day_computed: {
      get () { return this.calcDate(1, this.periodEnd) },
      set (value) { this.updatePeriodEnd(Date.parse(value)) }
    },
    end_day_computed2 () {
        return this.calcDate(2, this.periodEnd)
    },
    isNight: () => (timestamp) => {
      let d = new Date(timestamp);
      let hour = d.getHours();
      return !(hour > 6 && hour < 21)
    },
    isNurse: () => (user_id) => {
      return user_id === 'u0'
    },
    getPatients () {
      return this.filteredPatients
    },
    orderArrays () {
      return this.patientsArrays;
    },
    ...mapState([
      'currentUser',
      'memos',
      'periodStart',
      'periodEnd',
      'usersObject',
      'patientsArrays'])
    },
    ...mapGetters([
      // 'getUserName',
      'getPatientName',
      // 'filteredMemos',
      'filteredPatients'
    ]),
  // beforeUpdate () {
  //     console.log('beforeUpdate');
  // },
  // updated () {
  //   // this.tmp_patient = ''
  //     console.log('1updated');
  // },
  methods: {
    findby: function (pid) {
      if (pid == null) return ''
      return this.memos.filter(memo => {
          return memo.patient_id == pid
      })
    },
    calcDate (type, timestamp) {
        const o = new Date(timestamp)
        const M = new String(o.getMonth() + 1)
        const d = new String(o.getDate())
        let cne = '-' 
        if (type == 2) cne = '/'
        const s =
          o.getFullYear() + cne +
          (M.length == 1 ? '0' + M : M) + cne +
          (d.length == 1 ? '0' + d : d)
        return s
    },
    getTdDate: function (patient_id, timestamp) {
          console.log('-------getTdDate', this.tmp_patient, patient_id);
      const d = new Date(timestamp);
      const tmp = d.toLocaleDateString()
      if (this.tmp_patient === '' || this.tmp_patient !== patient_id ) {
          console.log('-------kita1',patient_id);
        this.tmp_patient = patient_id
        this.tmp_date = tmp;
          // console.log('-------kita1',tmp);
        return tmp
      }
      // // 初回、人が変わる
      // const d = new Date(timestamp);
      //     // console.log('-------kita1',d);
      // const tmp = d.toLocaleDateString()
      // //     console.log('-------kita1',tmp);
      // // console.log('-------',this.tmp_patient, patient_id, tmp);
      // if (this.tmp_patient === '' || this.tmp_patient !== patient_id) {
      //   this.tmp_patient = patient_id
      //   this.tmp_date = tmp;
      //     // console.log('-------kita1',tmp);
      //   return tmp
      // } else if (this.tmp_patient === patient_id) {
      //   if (this.tmp_date !== tmp) {
      //     this.tmp_date = tmp
      //     // console.log('-------kita2');
      //     // console.log('-------kita2',tmp);
      //     return tmp
      //   }
      // }
      // return '' 
    },
    ts2dt (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleDateString();
    },
    ts2tm (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleTimeString().slice(0, -3);
    },
    dayNext () {
      if (this.daysAgo > 0) {
        this.daysAgo -= 1;
      }
      this.updatePeriod(this.daysAgo + 'd');
    },
    dayPrev () {
      if (this.daysAgo < 7) {
        this.daysAgo += 1;
      }
      this.updatePeriod(this.daysAgo + 'd');
    },
    shown (event) {
      console.log("shown");
      this.updateOrder(this.selectedOrder);
    },
    print () {
        window.print();
    },
    updateOrder (value) {
      console.log("updateOrder:", value);
      this.selectedOrder = value;
      this.updateOrderPatient(value);
    },
    ...mapActions([
      'login',
      'logout',
      'updatePeriod',
      'updatePeriodStart',
      'updatePeriodEnd',
      'syncDbMemos',
      'updateOrderPatient'
    ])
  },
  created () {
    if (location.search) {
      const a = location.search.match(/d=(.*?)(&|$)/);
      if (a) {
        const d = decodeURIComponent(a[1]);
        if (0 <= d && d <= 7) {
          this.daysAgo = d;
        }
      }
    }
    this.syncDbMemos().then((synced) => {
      console.log(this.daysAgo + 'd');
      this.updatePeriod(this.daysAgo + 'd');
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@charset "UTF-8";

@page {
    /* size: A4 landscape; */
    size:portrait;
}

/* 印刷時のみの設定 */
@media print {
.noprint{
  display: none;
}

article {
  margin-bottom: 0;
}
.ttl {
  display: block;
}
}

*{
    margin: 0;
    padding: 0;
}

/* .ttl {
  display: none;
} */
article {
  margin-bottom: 25px;
}
.body{
    font-family: Helvetica, '\30E1\30A4\30EA\30AA', Meiryo;
    font-size: 100%;
    /* font-size: 15px;  */
    -webkit-print-color-adjust: exact;
}
.width5p{
    width: 5% !important;
}
.width10p{
    width: 10% !important;
}
.width15p{
    width: 15% !important;
}
.width20p{
    width: 20% !important;
}
.width45p{
    width: 45% !important;
}
.font-large{
    font-size: 2em !important;
}
.font-medium{
    font-size: 1.4em !important;
}
.font-small{
    font-size: 0.8em !important;
}
select{
    border :1px solid;
    font-size: 0.8em;
    padding: 0 2px 4px 2px;
}
.login-btn{
    margin: 20px auto;
    text-align: center;
}
div.table-box{
    margin: 18px auto;
    width: 1000px;
    position: relative;
    page-break-inside: avoid;
}
div.table-box .logo{
    position: absolute;
    top: 0;
    left: 0;
}
.box {
    overflow: hidden;
    position: relative;
}
.ttl {
    text-align: center;
    width: 300px;
    margin: 0 auto;
    font-size: 1.2em;
    font-weight: bold;
}
.date {
    font-size: 0.8em;
}
.right{
    float: right;
    text-align: right;
    width: 200px;
}
.name{
    float: left;
    width: 200px;
}
div.table-box .number{
    position: absolute;
    top: 10px;
    right: 0;
    font-size: 1.4em;
}
div.table-box .revision{
    position: absolute;
    bottom: -20px;
    right: 2px;
    font-size: 0.8em;
}
img.adjust02{
    max-width: 40%;
    height: auto;
}
img.adjust03{
    max-width: 60%;
    height: auto;
}
caption{
    font-weight: bold;
    font-size: 1.6em;
    letter-spacing: 14px;
}
table{
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    /* font-size: 1.4em; */
}
table td:first-of-type,
table th{
    white-space: nowrap;
}
table th{
    border-bottom: 1px solid #000;
}
table th{
    padding: 4px 4px;
}

table td{
    padding: 0 4px;
    text-align: center;
    font-size: 0.9em;
}
table td:nth-of-type(4) {
    text-align: left;
}
table tr:first-child th{
    border-top: solid 2px;
}
table tr:last-child td{
    border-bottom: solid 2px;
}
table td:first-of-type {
    border-left: solid 2px;
}
table th:last-of-type,
table td:last-of-type {
    border-right: solid 2px;
}
table td {
    border-bottom: dotted 1px;
}
table th:nth-of-type(1){width: 10%;}
table th:nth-of-type(2){width: 10%;}
table th:nth-of-type(3){width: 10%;}
table th:nth-of-type(4){width: 50%;}
table th:nth-of-type(5){width: 10%;}
table th:nth-of-type(6){width: 10%;}
table th:nth-of-type(1),
table th:nth-of-type(2),
table th:nth-of-type(5),
table td:nth-of-type(1),
table td:nth-of-type(2),
table td:nth-of-type(5){
    border-right: solid 1px;
}
table th:first-of-type,
table td:first-of-type,
table th:nth-of-type(3),
table th:nth-of-type(4),
table td:nth-of-type(3),
table td:nth-of-type(4) {
    border-right: dotted 1px;
}
.double-bottom{
    border-bottom: double 2px !important;
}
.dotted-bottom{
    border-bottom: dotted 1px !important;
}
.dotted-right{
    border-right: dotted 1px !important;
}
.solid-right{
    border-right: solid 1px !important;
}
.solid3-left{
    border-left: solid 2px !important;
}
.bgcolor01{
    background-color: #ccffff !important;
}
.bgcolor02{
    background-color: #ffd8cc !important;
}
div.name-box{
    margin: 14px 0;
    width: 35%;
    border-bottom: solid 2px;
    display: table;
    font-weight: bold;
}
div.name-box .box-title{
    float: left;
    width: 30%;
    /* padding: 4px 8px; */
    display: table-cell;
    text-align : center;
    vertical-align: middle;
    white-space: nowrap;
}
div.name-box .name{
    width: 70%;
    /* padding: 4px 8px; */
    display: table-cell;
    vertical-align: middle;
    white-space: nowrap;
}
div.name-box .honorific{
    width: 10%;
    /* padding: 4px; */
    display: table-cell;
    text-align : right;
    vertical-align: middle;
}
.page-break{
    page-break-after: always;
}

/* 文字色変更用 */
.text-orange{
    color: #ffa500 !important;
}
.text-blue,
.td-blue > td > span{
    color: #81BEF7 !important;
}
.text-yellow{
    color: #FFFF00 !important;
}
.text-white{
    color: #FFFFFF !important;
}
.text-red,
.td-red > td > span {
    color: red !important;
}
/* タイトルバー部分 */
.head {
    background-color: #424242;
}
.titlebar{
    width: 1000px;
    margin: 0 auto;
    display: table;
    font-size: 1.6em;
}
.titlebar .info{
    width: 50%;
    padding: 4px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

/* タイトル部分 */
.title{
    text-align: left;
    padding: 8px;
}

/* email部分 */
.email{
    text-align: right;
}
.print-button{
    margin-right: 2rem;
}

/* 期間と名前の選択部分 */
.data-select{
    /* width: 1000px;
    margin: 0 auto;
    height: 50px;
    background-color: #424242; */
    /* display: table; */
    /* font-size: 1.6em; */
}
.data-select .info{
    /* width: 50%; */
    padding: 4px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
.data-select .detail{
    /* width: 100%; */
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    /* -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center; */
            padding-bottom: 15px;
}

/* 期間選択の部分 */
.data-select .data{
    padding: 0 4px;
    width: 70%;
}
.arrow-left{
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 17px 20px 17px 0;
    border-color: transparent #ffffff transparent transparent;
}
.arrow-right{
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 17px 0 17px 20px;
    border-color: transparent transparent transparent #ffffff;
}

/* 名前選択の部分 */
.data-select .caption{
    padding: 0 8px;
}
.page-break{
    page-break-after: always;
}

input[type="date"] {
	width:160px;
}
input[type="checkbox"]{
  margin-left: 10px;
  margin-top: 5px;
  /* margin: 10px 5px 20px; */
}

label {
  margin-left: 20px;
}

</style>
