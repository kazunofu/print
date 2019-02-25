import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import { computePeriod } from '../config'

Vue.use(Vuex)

var config = {
  // apiKey: "AIzaSyDSZg0FP1NudoWcUF3nDn7uksD2L1TfXJw",
  // authDomain: "carememo-backup.firebaseapp.com",
  // databaseURL: "https://carememo-backup.firebaseio.com",
  // // projectId: "carememo-backup",
  // storageBucket: "carememo-backup.appspot.com",
  // // messagingSenderId: "350987303595"

  apiKey: "AIzaSyB1zfcS4PVta4UIY0iX96RbidaUSwc3STw",
  authDomain: "first-firebase-2601f.firebaseapp.com",
  databaseURL: "https://first-firebase-2601f.firebaseio.com",
  storageBucket: "first-firebase-2601f.appspot.com",
}
firebase.initializeApp(config)

export default new Vuex.Store({
  state: {
    currentUser: 'anonymous',
    memos: [],
    memos2: [],
    memosSynced: false,
    usersArrays: [],
    patientsArrays: [],
    periodStart: null,
    periodEnd: null,
    orderPatient: null,
  },

  getters: {
    isNurse: (state) => (id) => {
      let user = state.usersArrays.filter(user => user['.key'] === id)[0]
      return user.syoku === 1
    },
    getUserName: (state) => (id) => {
      const user =  state.usersArrays.filter(user => user['.key'] == id)[0]
      return user ? user.name : ''
    },
    getPatientName: (state) => (id) => {
      let patient =  state.patientsArrays.filter(patient => patient['.key'] == id)[0]
      return patient ? patient.name : ''
    },
    getPatientNameFuse: (state) => (id) => {
      let patient =  state.patientsArrays.filter(patient => patient['.key'] == id)[0]
      return patient ? patient.name_fuse : ''
    },

    // フィルター後のmemoを返す
    filteredMemos (state) {
      if (state.orderPatient == null) return state.memos2 
      return state.memos2.filter(memo => {
          return memo.pid === state.orderPatient
      })
    }
  },
  
  mutations: {
    updateOrderPatient(state, patient) {
      state.orderPatient = patient == '' ? null : patient
    },
    setMemos2 (state, memo) {
      state.memos2 = memo
    },
    setUser (state, user) {
      state.currentUser = user ? user.email : 'anonymous'
    },
    setMemosSynced (state, synced) {
      console.log("setMemoSyced: " + synced)
      state.memosSynced = synced
    },
    setPeriodStart (state, ts) { state.periodStart = ts },
    setPeriodEnd (state, ts) { state.periodEnd = ts },
    setOrderPatient (state, patient) { state.orderPatient = patient },
    ...firebaseMutations
  },

  actions: {
    startSyncAuth ({commit, dispatch}) {
      return new Promise ((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          commit('setUser', user)
          if (user == null) {
            commit('setMemosSynced', false)
          } 
          // else {
          //   // dispatch('syncDbMemos')
          // }
          resolve(user)
        })
      })
    },
    login() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithRedirect(provider)
      }
    },
    logout() {
      firebase.auth().signOut()
    },
    syncDbOthers: firebaseAction( ({bindFirebaseRef}) => {
      bindFirebaseRef('usersArrays', firebase.database().ref('users'))
      bindFirebaseRef('patientsArrays', firebase.database().ref('patients').orderByChild('kana'))
    }),
    syncDbMemos: firebaseAction( ({state, commit, bindFirebaseRef}) => {
      return new Promise ((resolve, reject) => {
        var ref = firebase.database().ref('memos').orderByChild('timestamp_evented')
        ref = ref.startAt(state.periodStart).endAt(state.periodEnd + (24 * 60 * 60 * 1000))
        bindFirebaseRef('memos', ref, { readyCallback: () => {
          if (!state.memosSynced) {
            commit('setMemosSynced', true)
          }
          
          var ret = []
          // pid毎に配列を用意
          state.patientsArrays.forEach(patient => {
            ret[patient.number] = []
          })
          
          state.memos.forEach(memo => {
            var pid = String(memo.patient_id)
            var number = pid.replace( /p/g , "" ) 
            ret[number].push(memo)
          })
          
          let ret2 = []
          state.patientsArrays.forEach(patient => {
            var number = patient.number
            if (ret[number].length > 0) ret2.push({pid:'p'+number, memos:ret[number]})
          })
          commit('setMemos2', ret2)
          resolve(state.memosSynced)
        }})
      })
    }),

    updatePeriod({commit, dispatch}, by) {
      const [start, end] = computePeriod(by)
      commit('setPeriodStart', start)
      commit('setPeriodEnd', end)
      dispatch('syncDbMemos')
    },

    updatePeriodStart({commit, dispatch}, ts) {
      // let startTs = ts - 9 * 60 * 60 * 1000
      commit('setPeriodStart', ts)
      dispatch('syncDbMemos')
    },

    updatePeriodEnd({commit, dispatch}, ts) {
      // let endTs = ts - 9 * 60 * 60 * 1000 - (24 * 60 * 60 * 1000)
      commit('setPeriodEnd', ts)
      dispatch('syncDbMemos')
    },

  }
})
