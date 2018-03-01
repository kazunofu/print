import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import LoginPage from '../components/LoginPage'
import ListPage from '../components/ListPage'
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
    usersObject: null,
    usersArrays: [],
    patientsObject: null,
    patientsArrays: [],
    periodBy: 'any',
    periodStart: null,
    periodEnd: null
  },
  mutations: {
    setUser (state, user) {
      state.currentUser = user ? user.email : 'anonymous';
    },
    setPages (state, pages) { state.pages = pages; },
    pushPage (state, page) { state.pages.push(page); },
    setPeriodBy (state, by) { state.periodBy = by; },
    setPeriodStart (state, ts) { state.periodStart = ts; },
    setPeriodEnd (state, ts) { state.periodEnd = ts; },
    ...firebaseMutations
  },
  actions: {
    startSyncAuth ({commit}) {
      return new Promise ((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          commit('setUser', user);
          commit('setPages', user ? [ListPage] : [LoginPage]);
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
      bindFirebaseRef('patientsArrays', firebase.database().ref('patients'));
    }),
    syncDbMemos: firebaseAction( ({state, bindFirebaseRef}) => {
      var ref =
        firebase.database().ref('memos').orderByChild('timestamp_evented');
      if (state.periodStart) {
        ref = ref.startAt(state.periodStart);
      }
      if (state.periodEnd) {
        ref = ref.endAt(state.periodEnd);
      }
      bindFirebaseRef('memos', ref);
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
      dispatch('syncDbMemos');
    }
  }
});
