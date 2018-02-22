'use strict';

process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.add1 = functions.https.onRequest((request, response) => {
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  const app = new DialogflowApp({request, response});
  const db = admin.database();

  function userForNumber (userNumber) {
    console.log("userForNumber: " + userNumber);
    return db.ref('users').orderByChild('number').equalTo(userNumber)
      .once('value');
  }

  function patientForNumber (patientNumber) {
    console.log("patientForNumber: " + patientNumber);
    return db.ref('patients').orderByChild('number').equalTo(patientNumber)
      .once('value');
  }

  function responseHandlerAdd1 (app) {
    console.log("8");

    const number = app.getArgument('patient_number');
    const event = app.getArgument('patient_event');

    const promiseUid = userForNumber(1);
    const promisePid = patientForNumber(parseInt(number, 10));

    return Promise.all([promiseUid, promisePid]).then((snapshots) => {
      const users = snapshots[0];
      const patients = snapshots[1];
      console.log("users numChildren: " + users.numChildren());
      console.log("patients numChildren: " + patients.numChildren());
      var uid, user;
      var pid, patient;
      users.forEach((u) => {
        uid = u.key;
        user = u.val();
      });
      patients.forEach((p) => {
        pid = p.key;
        patient = p.val();
      });
      console.log("user uid: " + uid);
      console.log("user name: " + user.name);
      console.log("user number: " + user.number);
      console.log("patient pid: " + pid);
      console.log("patient name: " + patient.name);
      console.log("patient number: " + patient.number);
      return admin.database().ref('memos').push({
        timestamp: admin.database.ServerValue.TIMESTAMP,
        number: number,
        event: event,
        user_id: uid,
        patient_id: pid,
        face_confusion: true,
        face_dependence: false,
        face_daydream: false,
        title: "タイトル",
        event_care: event,
        timestamp_evented: admin.database.ServerValue.TIMESTAMP,
        timestamp_created: admin.database.ServerValue.TIMESTAMP,
        user_created: uid,
      }).then(snapshot => {
        console.log("success.");
        app.tell('患者さん' + number + '番の出来事、' + event + '、をメモしました。');
      }).catch((c2) => {
        console.log("c2");
        console.log(c2);
      });
    }).then((t1) => {
      console.log("t1");
    }).catch((c1) => {
      console.log("c1");
      console.log(c1);
    });
  }

  const actionMap = new Map();
  actionMap.set('add1', responseHandlerAdd1);

  app.handleRequest(actionMap);
});
