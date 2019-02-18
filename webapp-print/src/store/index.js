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
    patientsObject: null,
    patientsArrays: [],
    periodBy: 'any',
    periodStart: null,
    periodEnd: null,
    orderBy: 'timestamp_evented',
    orderUser: null,
    target_p: []
  },
  getters: {
    getUserName: (state) => (id) => {
      const user =  state.usersArrays.filter(user => user['.key'] == id)[0]
      return user ? user.name : ''
    },
    getPatientName: (state) => (id) => {
      const patient =  state.patientsArrays.filter(user => user['.key'] == id)[0]
      return patient ? patient.name : ''
    },
    filteredPatients (state) {
      console.log('filteredPatients start filteredPatients=',state.orderPatient);
      if (state.orderPatient == null) return state.patientsArrays
      return state.patientsArrays.filter(patient => {
          return patient.patient_id == state.orderPatient
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
    startSyncAuth ({commit, dispatch}) {
      return new Promise ((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          commit('setUser', user);
          if (user == null) {
            commit('setMemosSynced', false);
          } else {
            dispatch('syncDbMemos');
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
          let test =[]
          state.memos.forEach(item => {
            if (item.patient_id == 'p0') {
              test.push(item)
            }
          })
          state.memos2.push({name:'p0',mm:test})
          // for (var i = 0; i < Object.keys(this.memos).length; i++) {
          //   if (target_p.include(memos.patient_id) === false) {
          //     target_p.push(memos.patient_id)
          //   }
          // }
          resolve(state.memosSynced);
        }});
      });
    }),

    updatePeriod({commit, dispatch}, by) {
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
    
    // updateOrderPatient({commit, dispatch}, patient) {
    //   const p = patient == '' ? null : patient;
    //   commit('setOrderUser', null);
    //   commit('setOrderPatient', p);
    //   if (p) {
    //     commit('setOrderBy', 'patient_id_timestamp_evented');
    //   } else {
    //     commit('setOrderBy', 'timestamp_evented');
    //   }
    //   dispatch('syncDbMemos');
    // },

    updateOrderPatient({commit}, patient) {
      console.log('store updateOrderPatient start');
      const p = patient == '' ? null : patient;
      commit('setOrderPatient', p);
      console.log('store updateOrderPatient end');
    },
  }
});
