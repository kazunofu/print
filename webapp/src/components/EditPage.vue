<template>
  <v-ons-page>
    <v-ons-toolbar>

      <div class="title">
        <div class="left">セントケア&emsp;ケアログ&emsp;確認・修正</div>
      </div>

      <div>
        <div class="button-area">
          <div class="detail">
            <span @click="popPage" class="text-gray">キャンセル</span>
          </div>
          <div class="detail">
            <span @click="updateMemo(item) && popPage()" class="text-yellow">保存して戻る</span>
          </div>
        </div>
      </div>

    </v-ons-toolbar>

    <v-ons-list modifier="noborder">
      <v-ons-list-item modifier="nodivider">
        <div class="outer-frame">

          <div class="inner">
            <div class="detail">
              <div class="caption text-bright-blue">お客様</div>
              <div class="name">
                <v-ons-select v-model="item.patient_id">
                  <option v-for="p in patients"
                    :key="p.name" :value="p['.key']">
                    {{p.name}}
                  </option>
                </v-ons-select>
              </div>
            </div>
          </div>

          <div class="inner">
            <div class="detail">
              <div class="caption text-bright-orange">担当者</div>
              <div class="name">
                <v-ons-select v-model="item.user_id">
                  <option v-for="u in users"
                    :key="u.name" :value="u['.key']">
                    {{u.name}}
                  </option>
                </v-ons-select>
              </div>
            </div>
          </div>

        </div>
      </v-ons-list-item>

      <v-ons-list-item modifier="nodivider">
        <div class="left">日時：</div>
        <div class="center">
          <input style="font-size: 16px"
            type="datetime-local" v-model="timestamp_evented_computed">
        </div>
      </v-ons-list-item>

      <v-ons-list-item modifier="nodivider">
        <div class="left">項目：</div>
        <div class="center">
          <v-ons-input placeholder="項目" class="item-label"
            v-model="item.title"/>
        </div>
      </v-ons-list-item>

      <v-ons-list-item modifier="nodivider">
        <div class="left">表情：</div>
        <div class="center">
          <div class="outer-frame">
            <div class="inner">混乱期<br><v-ons-switch modifier="material" v-model="item.face_confusion"/></div>
            <div class="inner">依存期<br><v-ons-switch modifier="material" v-model="item.face_dependence"/></div>
            <div class="inner">昼夢期<br><v-ons-switch modifier="material" v-model="item.face_daydream"/></div>
          </div>
        </div>
      </v-ons-list-item>

      <v-ons-list-item modifier="nodivider">
        <div class="left">メモ：</div>
        <div class="center"><textarea class="textarea" style="width:100%;"
          rows="7"
          v-model="item.event_care"></textarea></div>
      </v-ons-list-item>

      <v-ons-list-item modifier="nodivider">
        <div class="left">笑顔：</div>
        <div class="center"><textarea class="textarea" style="width:100%;"
          rows="5"
          v-model="item.event_smile"></textarea></div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>


<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'EditPage',
  computed: {
    timestamp_evented_computed: {
      get () {
        const o = new Date(this.item.timestamp_evented);
        const M = new String(o.getMonth() + 1);
        const d = new String(o.getDate());
        const h = new String(o.getHours());
        const m = new String(o.getMinutes());
        const s =
          o.getFullYear() + "-" +
          (M.length == 1 ? "0" + M : M) + "-" +
          (d.length == 1 ? "0" + d : d) + "T" +
          (h.length == 1 ? "0" + h : h) + ":" +
          (m.length == 1 ? "0" + m : m) ;
        return s;
      },
      set (value) {
        this.item.timestamp_evented = Date.parse(value);
      }
    },
    ...mapState([
      'currentUser',
      'usersObject',
      'users',
      'patients'])
  },
  methods: {
    ...mapActions(['logout', 'updateMemo', 'popPage'])
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
  .text-gray {
      color: #A9A9A9 !important;
  }
  /* ツールバー部分 */
  .toolbar {
      flex-direction: column;
  }
  /* タイトル部分 */
  .title {
      padding: 8px;
      height: 41px;
  }
  /* ボタン部分 */
  .button-area {
      width: 100%;
      height: 50px;
      background-color: #424242;
      display: table;
  }
  .button-area .detail {
      width: 50%;
      padding: 0 30px;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
  }
  /* 横並び配置用 */
  .outer-frame {
      width: 100%;
      display: table;
  }
  .outer-frame .inner {
      padding: 4px;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
  }
  /* 名前選択の部分 */
  .outer-frame .detail {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .outer-frame .caption {
      padding: 0 8px;
  }
  .item-label {
    background-color: white;
  }
</style>
