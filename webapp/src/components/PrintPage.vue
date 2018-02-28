<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">日常生活経過記録</div>
    </v-ons-toolbar>
    <article v-for="p in patientsArrays" :key="p.name">
      <div class="table-box">
        <div class="logo"><img src="../assets/logo.png" alt="セントケアロゴマーク" class="adjust03"></div>
        <div class="date">2018年&nbsp;00月&nbsp;00日</div>
        <div class="number">NO．0000000000</div>
        <table>
          <caption>〈日常生活経過記録〉</caption>
          <thead>
            <tr>
              <th rowspan="2" class="double-bottom solid3-left">時間</th>
              <th rowspan="2" class="double-bottom solid-right ">項目</th>
              <th colspan="3" class="bgcolor01 dotted-bottom">表情</th>
              <th rowspan="2" class="bgcolor01 double-bottom">観察内容・ケア内容</th>
              <th class="bgcolor02">笑顔</th>
              <th rowspan="2" class="double-bottom">記入者</th>
            </tr>
            <tr>
              <th class="double-bottom width40"><span class="font-small">混乱期</span><br><img src="../assets/face01.png" alt="混乱期の表情" class="adjust03"></th>
              <th class="dotted-right double-bottom width40"><span class="font-small">依存期</span><br><img src="../assets/face02.png" alt="依存期の表情" class="adjust03"></th>
              <th class="double-bottom width40"><span class="font-small">昼夢期</span><br><img src="../assets/face03.png" alt="昼夢期の表情" class="adjust03"></th>
              <th class="double-bottom"><img src="../assets/smile.png" alt="笑顔のイラスト" class="adjust02"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in memos" :key="m['.key']" v-if="m.patient_id == p['.key']">
              <td>{{ts2dt(m.timestamp_evented)}}</td>
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
        <div class="name-box"><span class="box-title">お客様氏名</span><span class="font-large">{{p.name}}</span><span class="font-large honorific">様</span></div>
        <div class="revision">セントケア・グループ&nbsp;2014.01改訂</div>
      </div>
　　</article>
  </v-ons-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PrintPage',
  computed: {
    ...mapState([
      'memos',
      'usersObject',
      'patientsArrays'])
  },
  methods: {
    ts2dt (timestamp) {
      const d = new Date(timestamp);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    },
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

body {
    font-family: Helvetica, 'メイリオ', Meiryo;
    font-size: 62.5%;
    -webkit-print-color-adjust: exact;
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

.width40 {
    width: 40px !important;
}

div.table-box {
    margin: 18px auto;
    width: 90%;
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
    bottom: 10px;
    right: 10px;
    font-size: 0.8em;
}

img.adjust01 {
    max-width: 30%;
    height: auto;
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

table th,
table td {
    padding: 2px 4px;
}

table td:nth-of-type(8),
table td:nth-of-type(-n+5) {
    text-align: center;
}

table td:first-of-type,
table th:last-of-type {
    white-space: nowrap;
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
    position: relative;
    margin: 20px 0;
    padding: 5px 20px;
    width: 300px;
    border: solid 3px;
    font-weight: bold;
}

div.name-box .box-title {
    position: absolute;
    display: inline-block;
    top: -13px;
    left: 10px;
    padding: 0 9px;
    line-height: 1;
    font-size: 1.4em;
    background: #fff;
}

div.name-box .honorific {
    position: absolute;
    right: 10px;
}
</style>
