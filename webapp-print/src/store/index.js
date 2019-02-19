import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import { computePeriod } from '../config';

Vue.use(Vuex)

var config = {
  apiKey: "AIzaSyB1zfcS4PVta4UIY0iX96RbidaUSwc3STw",
  authDomain: "first-firebase-2601f.firebaseapp.com",
  databaseURL: "https://first-firebase-2601f.firebaseio.com",
  storageBucket: "first-firebase-2601f.appspot.com",
};
firebase.initializeApp(config);


export default new Vuex.Store({
  state: {
    currentUser: 'anonymous',
    memos: [],
    memos2: [],
    memosSynced: false,
    usersObject: null,
    usersArrays: [],
    filteredPatients2: [],
    patientsObject: null,
    patientsArrays: [],
    periodBy: 'any',
    periodStart: null,
    periodEnd: null,
    orderBy: 'timestamp_evented',
    orderPatient: null,
    orderUser: null,
    target_p: []
  },
  getters: {
    // getUserName: (state) => (id) => {
    //   const user =  state.usersArrays.filter(user => user['.key'] == id)[0]
    //   return user ? user.name : ''
    // },
    getPatientName: (state) => (id) => {
      const patient =  state.patientsArrays.filter(user => user['.key'] == id)[0]
      return patient ? patient.name : ''
    },
    filteredPatients (state) {
      console.log('filteredPatients start filteredPatients=',state.orderPatient);
      // if (state.orderPatient == null) return state.patientsArrays
      return state.patientsArrays.filter(patient => {
        if (state.orderPatient == null) {
          return state.filteredPatients2.includes(patient['.key'])
        } else 
          return state.filteredPatients2.includes(patient['.key']) && patient['.key'] === state.orderPatient
      })
    },
    // // フィルター後のmemoを返す
    // filteredMemos (state) {
    //   if (state.orderPatient == null) return state.memos 
    //   return state.memos.filter(memo => {
    //       return memo.patient_id == state.orderPatient
    //   })
    // }
  },
  mutations: {
    updateOrderPatient(state, patient) {
      let p = patient == '' ? null : patient;
      state.orderPatient = p
    },
    setfilteredPatients2 (state, user) {
      state.filteredPatients2 = user
    },
    setMemo2 (state, memo) {
      state.memos2 = memo
    },
    setUser (state, user) {
      state.currentUser = user ? user.email : 'anonymous';
    },
    setMemosSynced (state, synced) {
      console.log("setMemoSyced: " + synced);
      state.memosSynced = synced;
    },
    setPeriodBy (state, by) { state.periodBy = by; },
    setPeriodStart (state, ts) { state.periodStart = ts; },
    setPeriodEnd (state, ts) { state.periodEnd = ts; },
    setOrderBy (state, by) { state.orderBy = by; },
    setOrderPatient (state, patient) { state.orderPatient = patient; },
    ...firebaseMutations
  },
  actions: {
    // getUserName(id) {
    //   const user =  this.usersArrays.filter(user => user['.key'] == id)[0]
    //   return user ? user.name : ''
    // },
    startSyncAuth ({commit, dispatch}) {
      return new Promise ((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          commit('setUser', user);
          if (user == null) {
            commit('setMemosSynced', false);
          } else {
            // dispatch('syncDbMemos');
          }
          resolve(user);
        });
      });
    },
    login() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
      }
    },
    logout() {
      firebase.auth().signOut();
    },
    syncDbOthers: firebaseAction( ({bindFirebaseRef}) => {
      bindFirebaseRef('usersObject', firebase.database().ref('users'));
      bindFirebaseRef('usersArrays', firebase.database().ref('users'));
      bindFirebaseRef('patientsObject', firebase.database().ref('patients'));
      bindFirebaseRef('patientsArrays', firebase.database().ref('patients').orderByChild('kana'));
    }),
    syncDbMemos: firebaseAction( ({state, commit, bindFirebaseRef}) => {
      return new Promise ((resolve, reject) => {
        var ref = firebase.database().ref('memos').orderByChild(state.orderBy);
        ref = ref.startAt(state.periodStart).endAt(state.periodEnd);
        bindFirebaseRef('memos', ref, { readyCallback: () => {
          if (!state.memosSynced) {
            commit('setMemosSynced', true);
          }
          // this.memos.map(item => ({ ...item, face_confusion: true }))
          // let test = []
          // state.memos2 = []
          // state.memos.forEach(item => {
          //   if (item.patient_id == 'p0') {
          //     test.push(item)
          //   }
          // })
          //単配列の宣言
          var ret = [];
          
          state.memos.forEach(item => {
            if (!ret.includes(item.patient_id)) {
              ret.push(item.patient_id)
            }
          })
          
          commit('setfilteredPatients2', ret);
          
          // //for文で要素を格納する
          // // for(var i=0; i<state.patientsArrays.length; i++){
          // //   //配列の要素数を指定する
          // //   console.log('|||||||||||||||------------state.patientsArrays.number- '+state.patientsArrays.number)
          // //   array[state.patientsArrays.number] = [];
          // // }
          // state.patientsArrays.forEach(item => {
          //   ret[item.number] = [];
          // })
          
          // console.log('ret.length-------------'+ ret.length);
          // state.memos.forEach(item => {
          //   var pid = String(item.patient_id)
          //   var a = pid.replace( /p/g , "" ) ;
          //   ret[a].push(item)
          //   // console.log('[a]-------------'+ a);
          //   // console.log('ret[a]-------------'+ ret[a]);
          // })
          // console.log('ret[0]-------------'+ ret[1]);
          // // for(var i=0; i<state.patientsArrays.length; i++){
          // //   var num = state.patientsArrays.number
          // //   state.memos2.push({name:'p'+num, mm:array[num]})
          // // }
          // let ret2 = []
          // state.patientsArrays.forEach(item => {
          //   var num = item.number
          //   console.log('|||||||||||||||------------item.number- '+num)
          //   console.log('|||||||||||||||------------ ret[num] '+ret[num])
          //   // state.memos2.push({name:num, mm:ret[num]})
          //   ret2.push({name:'p'+num, mm:ret[num]})
          // })
          //   commit('setMemo2', ret2);
          resolve(state.memosSynced);
        }});
      });
    }),

    updatePeriod({commit, dispatch}, by) {
      console.log('updatePeriod-start-------------'+ by);
      commit('setPeriodBy', by);
      const [start, end] = computePeriod(by);
      commit('setPeriodStart', start);
      commit('setPeriodEnd', end);
      dispatch('syncDbMemos');
    },
    updatePeriodStart({commit, dispatch}, by) {
      console.log('updatePeriodStart-start-------------'+ by);
      
      let start = by - 9 * 60 * 60 * 1000

      console.log(start);
      commit('setPeriodStart', start)
      dispatch('syncDbMemos')
    },

    updatePeriodEnd({commit, dispatch}, by) {
      console.log('updatePeriodEnd-start-------------'+ by);
      
      let start = by - 9 * 60 * 60 * 1000
      let end = start + 24 * 60 * 60 * 1000 - 1

      console.log(end);
      commit('setPeriodEnd', end)
      // console.log('store updatePeriod')
      dispatch('syncDbMemos')
    },
    

  }
});
