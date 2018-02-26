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

  function userForNumber (number) {
    console.log("userForNumber: " + number);
    return db.ref('users').orderByChild('number').equalTo(number)
      .once('value');
  }

  function patientForNumber (number) {
    console.log("patientForNumber: " + number);
    return db.ref('patients').orderByChild('number').equalTo(number)
      .once('value');
  }

  function faceForName (name) {
    console.log("faceForName: " + name);
    return db.ref('faces').orderByChild('name').equalTo(name)
      .once('value');
  }

  function responseHandlerAdd1 (app) {
    console.log("18");

    const userNumber = app.getArgument('user_number');
    const patientNumber = app.getArgument('patient_number');
    const event = app.getArgument('patient_event');
    const title = app.getArgument('title');
    const smile = app.getArgument('smile');
    const faceName = app.getArgument('face');

    const promiseUid = userForNumber(parseInt(userNumber, 10));
    const promisePid = patientForNumber(parseInt(patientNumber, 10));
    const promiseFid = faceName ? faceForName(faceName) : null;
    const promiseAll = [promiseUid, promisePid, promiseFid];

    return Promise.all(promiseAll).then((snapshots) => {
      const users = snapshots[0];
      const patients = snapshots[1];
      const faces = snapshots[2];
      console.log("users numChildren: " + users.numChildren());
      console.log("patients numChildren: " + patients.numChildren());
      if (faces) {
        console.log("faces numChildren: " + faces.numChildren());
      }
      var uid, user;
      var pid, patient;
      var fid, face;
      users.forEach((u) => {
        uid = u.key;
        user = u.val();
      });
      patients.forEach((p) => {
        pid = p.key;
        patient = p.val();
      });
      if (faces) {
        faces.forEach((f) => {
          fid = f.key;
          face = f.val();
        });
      }
      console.log("user uid: " + uid);
      console.log("user name: " + user.name);
      console.log("user number: " + user.number);
      console.log("patient pid: " + pid);
      console.log("patient name: " + patient.name);
      console.log("patient number: " + patient.number);
      if (fid && face) {
        console.log("face fid: " + fid);
        console.log("face name: " + face.name);
      }
      const item = {
        timestamp: admin.database.ServerValue.TIMESTAMP,
        number: patientNumber,
        event: event,
        user_id: uid,
        patient_id: pid,
        title: title,
        event_care: event,
        event_smile: smile,
        timestamp_evented: admin.database.ServerValue.TIMESTAMP,
        timestamp_created: admin.database.ServerValue.TIMESTAMP,
        user_created: uid, };
      if (fid && face) { item[fid] = true; }
      return admin.database().ref('memos').push(item).then(snapshot => {
        console.log("success.");
        app.tell(
          '患者さん' + patientNumber + '番のメモ、' +
          title + 'について、' +
          event + '、をメモしました。');
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
