<template>
  <div class="body">
    <div class="titlebar noprint font-large">
      <div class="info text-white">
        <div class="title">セントケア&emsp;ケアログ&emsp;印刷</div>
      </div>
      <div class="info text-blue">
        <div class="email" @click="logout">{{currentUser}}</div>
      </div>
    </div>
    <div v-if="currentUser == 'anonymous'" class="noprint login-btn">
      <img src="../assets/btn_google_signin_light_normal_web.png" @click="login">
    </div>
    <div v-else @show="shown($event)">
      <div class="data-select noprint font-large">
        <div class="info">
          <div class="detail">
            <div class="arrow-left" @click="dayPrev"></div>
            <div class="data text-white">
              <span v-if="daysAgo==0">今日</span>
              <span v-else>{{daysAgo}}日前</span>
            </div>
            <div class="arrow-right" @click="dayNext"></div>
          </div>
        </div>
        <div class="info" v-if="orderArrays != null">
          <div class="detail">
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
        v-for="p in patientsArrays"
        :key="p.name"
        v-if="selectedOrder == '' || selectedOrder == p['.key']"
        class="page-break">
        <div class="table-box">
          <div class="logo"><img src="../assets/logo.png" alt="セントケアロゴマーク" class="adjust03"></div>
          <div class="date">{{dateYear}}年&nbsp;{{dateMonth}}月&nbsp;{{dateDate}}日</div>
          <table>
            <caption>〈日常生活経過記録〉</caption>
            <thead>
              <tr>
                <th rowspan="2" class="double-bottom solid3-left width5p">時間</th>
                <th rowspan="2" class="double-bottom solid-right width10p">項目</th>
                <th colspan="3" class="bgcolor01 dotted-bottom width15p">表情</th>
                <th rowspan="2" class="bgcolor01 double-bottom width45p">観察内容・ケア内容</th>
                <th class="bgcolor02 width20p">笑顔</th>
                <th rowspan="2" class="double-bottom width5p">担当者</th>
              </tr>
              <tr>
                <th class="double-bottom"><span class="font-small">混乱期</span><br><img src="../assets/face01.png" alt="混乱期の表情" class="adjust03"></th>
                <th class="dotted-right double-bottom"><span class="font-small">依存期</span><br><img src="../assets/face02.png" alt="依存期の表情" class="adjust03"></th>
                <th class="double-bottom"><span class="font-small">昼夢期</span><br><img src="../assets/face03.png" alt="昼夢期の表情" class="adjust03"></th>
                <th class="double-bottom"><img src="../assets/smile.png" alt="笑顔のイラスト" class="adjust02"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in memos" :key="m['.key']" v-if="m.patient_id == p['.key']">
                <td>{{ts2tm(m.timestamp_evented)}}</td>
                <td>{{m.title}}</td>
                <td>{{m.face_confusion ? '✔' : '&nbsp;'}}</td>
                <td>{{m.face_dependence ? '✔' : '&nbsp;'}}</td>
                <td>{{m.face_daydream ? '✔' : '&nbsp;'}}</td>
                <td>{{m.event_care}}</td>
                <td>{{m.event_smile}}</td>
                <td>{{usersObject[m.user_id].name}}</td>
              </tr>
            </tbody>
          </table>
            <div class="name-box">
              <div class="box-title">お客様<br>氏名</div>
              <div class="name font-large">{{p.name}}</div>
              <div class="honorific font-large">様</div>
            </div>
            <div class="revision">セントケア・グループ&nbsp;2018.05Web改訂</div>
        </div>
　　  </article>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PrintPage',
  data () {
    return {
      daysAgo: 0,
      selectedOrder: ''
    }
  },
  computed: {
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
      return this.patientsArrays;
    },
    ...mapState([
      'currentUser',
      'memos',
      'usersObject',
      'patientsArrays'])
  },
  methods: {
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
    updateOrder (value) {
      console.log("updateOrder:", value);
      this.selectedOrder = value;
      this.updateOrderPatient(value);
    },
    ...mapActions([
      'login',
      'logout',
      'updatePeriod',
      'syncDbMemos',
      'updateOrderPatient'
    ])
  },
  created () {
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
    size: A4 landscape;
}

* {
    margin: 0;
    padding: 0;
}

.body {
    font-family: Helvetica, 'メイリオ', Meiryo;
    font-size: 62.5%;
    -webkit-print-color-adjust: exact;
}

.width5p {
    width: 5% !important;
}

.width10p {
    width: 10% !important;
}

.width15p {
    width: 15% !important;
}

.width20p {
    width: 20% !important;
}

.width45p {
    width: 45% !important;
}

.font-large {
    font-size: 2em !important;
}

.font-medium {
    font-size: 1.4em !important;
}

.font-small {
    font-size: 0.8em !important;
}

select {
    border :1px solid;
    font-size: 0.8em;
    padding: 0 2px 4px 2px;
}

.login-btn {
    margin: 20px auto;
    text-align: center; 
}

div.table-box {
    margin: 18px auto;
    width: 1000px;
    position: relative;
    page-break-inside: avoid;
}

div.table-box .logo {
    position: absolute;
    top: 0;
    left: 0;
}

div.table-box .date {
    position: absolute;
    top: 4px;
    left: 80px;
    font-weight: bold;
    font-size: 2.2em;
}

div.table-box .number {
    position: absolute;
    top: 10px;
    right: 0;
    font-size: 1.4em;
}

div.table-box .revision {
    position: absolute;
    bottom: 4px;
    right: 10px;
    font-size: 0.8em;
}

img.adjust02 {
    max-width: 40%;
    height: auto;
}

img.adjust03 {
    max-width: 60%;
    height: auto;
}

caption {
    font-weight: bold;
    font-size: 1.6em;
    letter-spacing: 14px;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 1.4em;
}

table td:first-of-type,
table th {
    white-space: nowrap;
}

table th,
table td {
    padding: 2px 4px;
}

table td:nth-of-type(8),
table td:nth-of-type(-n+5) {
    text-align: center;
}

table tr:first-child th {
    border-top: solid 3px;
}

table tr:last-child td {
    border-bottom: solid 3px;
}

table td:first-of-type {
    border-left: solid 3px;
}

table th:last-of-type,
table td:last-of-type {
    border-right: solid 3px;
}

table td,
table th:nth-of-type(5) {
    border-bottom: dotted 1px;
}

table th:nth-of-type(3),
table th:nth-of-type(4),
table th:nth-of-type(5),
table td:nth-of-type(2),
table td:nth-of-type(5),
table td:nth-of-type(6),
table td:nth-of-type(7) {
    border-right: solid 1px;
}

table th:first-of-type,
table td:first-of-type,
table td:nth-of-type(3),
table td:nth-of-type(4) {
    border-right: dotted 1px;
}

.double-bottom {
    border-bottom: double 3px !important;
}

.dotted-bottom {
    border-bottom: dotted 1px !important;
}

.dotted-right {
    border-right: dotted 1px !important;
}

.solid-right {
    border-right: solid 1px !important;
}

.solid3-left {
    border-left: solid 3px !important;
}

.bgcolor01 {
    background-color: #ccffff !important;
}

.bgcolor02 {
    background-color: #ffd8cc !important;
}

div.name-box {
    margin: 14px 0;
    width: 30%;
    border: solid 3px;
    display: table;
    font-weight: bold;
}

div.name-box .box-title {
    width: 20%;
    padding: 4px 8px;
    display: table-cell;
    text-align : center;
    vertical-align: middle;
    background-color: #bdbdbd;
    border-right: solid 1px;
    white-space: nowrap;
}

div.name-box .name {
    width: 70%;
    padding: 4px 8px;
    display: table-cell;
    vertical-align: middle;
    white-space: nowrap;
}

div.name-box .honorific {
    width: 10%;
    padding: 4px;
    display: table-cell;
    text-align : right;
    vertical-align: middle;
}

.page-break {
    page-break-after: always;
}

/* 文字色変更用 */
.text-orange {
    color: #ffa500 !important;
}
.text-blue {
    color: #81BEF7 !important;
}
.text-yellow {
    color: #FFFF00 !important;
}
.text-white {
    color: #FFFFFF !important;
}
/* タイトルバー部分 */
.titlebar {
    width: 1000px;
    margin: 0 auto;
    background-color: #424242;
    display: table;
    font-size: 1.6em;
}
.titlebar .info {
    width: 50%;
    padding: 4px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
/* タイトル部分 */
.title {
    text-align: left;
    padding: 8px;
}
/* email部分 */
.email {
    text-align: right;
}
/* 期間と名前の選択部分 */
.data-select {
    width: 1000px;
    margin: 0 auto;
    height: 50px;
    background-color: #424242;
    display: table;
    font-size: 1.6em;
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
/* 印刷時のみの設定 */
@media print {
    .noprint {
        display: none;
    }
}
</style>
