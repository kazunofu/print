import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import LoginPage from '../components/LoginPage'
import ListTabbar from '../components/ListTabbar'
import { computePeriod } from '../config';

Vue.use(Vuex)

var config = {
  apiKey: "AIzaSyDaHq2oq6VZmjwACsUaI9NXqj-KtB70KLI",
  authDomain: "carememo1.firebaseapp.com",
  databaseURL: "https://carememo1.firebaseio.com",
  storageBucket: "carememo1.appspot.com",
};
firebase.initializeApp(config);


export default new Vuex.Store({
  state: {
    currentUser: 'anonymous',
    pages: [LoginPage],
    memos: [],
    memosSynced: false,
    usersObject: null,
    usersArrays: [],
    patientsObject: null,
    patientsArrays: [],
    periodBy: '0d',
    periodStart: null,
    periodEnd: null,
    orderBy: 'timestamp_evented',
    orderUser: null,
    orderPatient: null,
  },
  mutations: {
    setUser (state, user) {
      state.currentUser = user ? user.email : 'anonymous';
    },
    setMemosSynced (state, synced) { state.memosSynced = synced; },
    setPages (state, pages) { state.pages = pages; },
    pushPage (state, page) { state.pages.push(page); },
    popPage (state) { state.pages.pop(); },
    setPeriodBy (state, by) { state.periodBy = by; },
    setPeriodStart (state, ts) { state.periodStart = ts; },
    setPeriodEnd (state, ts) { state.periodEnd = ts; },
    setOrderBy (state, by) { state.orderBy = by; },
    setOrderUser (state, user) { state.orderUser = user; },
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
            commit('setPages', [LoginPage]);
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
    popPage ({commit}) {
      commit('popPage');
    },
    syncDbOthers: firebaseAction( ({bindFirebaseRef}) => {
      bindFirebaseRef('usersObject', firebase.database().ref('users'));
      bindFirebaseRef('usersArrays', firebase.database().ref('users'));
      bindFirebaseRef('patientsObject', firebase.database().ref('patients'));
      bindFirebaseRef('patientsArrays', firebase.database().ref('patients'));
    }),
    syncDbMemos: firebaseAction( ({state, commit, bindFirebaseRef}) => {
      console.log('store syncDbMeos start');
      var ref = firebase.database().ref('memos').orderByChild(state.orderBy);
      if (state.orderUser) {
        if (state.periodStart) {
          ref = ref.startAt(state.orderUser + "_" + state.periodStart);
        } else {
          ref = ref.startAt(state.orderUser + "_" + 0);
        }
        if (state.periodEnd) {
          ref = ref.endAt(state.orderUser + "_" + state.periodEnd);
        } else {
          ref = ref.endAt(state.orderUser + "_" + Date.UTC(2038, 0));
        }
      } else if (state.orderPatient) {
        if (state.periodStart) {
          ref = ref.startAt(state.orderPatient + "_" + state.periodStart);
        } else {
          ref = ref.startAt(state.orderPatient + "_" + 0);
        }
        if (state.periodEnd) {
          ref = ref.endAt(state.orderPatient + "_" + state.periodEnd);
        } else {
          ref = ref.endAt(state.orderPatient + "_" + Date.UTC(2038, 0));
        }
      } else {
        if (state.periodStart) {
          ref = ref.startAt(state.periodStart);
        }
        if (state.periodEnd) {
          ref = ref.endAt(state.periodEnd);
        }
      }
      bindFirebaseRef('memos', ref, { readyCallback: () => {
        if (!state.memosSynced) {
          commit('setMemosSynced', true);
          commit('setPages',
            state.currentUser == 'anonymous' ? [LoginPage] : [ListTabbar]);
        }
      }});
      console.log('store syncDbMeos end');
    }),
    updateMemo: firebaseAction( (context, item) => {
      var copy = {...item};
      delete copy['.key'];
      firebase.database().ref('memos/' + item['.key']).set(copy);
    }),
    updatePeriod({commit, dispatch}, by) {
      commit('setPeriodBy', by);
      const [start, end] = computePeriod(by);
      commit('setPeriodStart', start);
      commit('setPeriodEnd', end);
      console.log('store updatePeriod');
      dispatch('syncDbMemos');
    },
    updateOrderUser({commit, dispatch}, user) {
      const u = user == '' ? null : user;
      commit('setOrderUser', u);
      commit('setOrderPatient', null);
      if (u) {
        commit('setOrderBy', 'user_id_timestamp_evented');
      } else {
        commit('setOrderBy', 'timestamp_evented');
      }
      console.log('store updateOrderUser');
      dispatch('syncDbMemos');
    },
    updateOrderPatient({commit, dispatch}, patient) {
      const p = patient == '' ? null : patient;
      commit('setOrderUser', null);
      commit('setOrderPatient', p);
      if (p) {
        commit('setOrderBy', 'patient_id_timestamp_evented');
      } else {
        commit('setOrderBy', 'timestamp_evented');
      }
      console.log('store updateOrderPatient');
      dispatch('syncDbMemos');
    },
  }
});
