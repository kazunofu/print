'use strict';

process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.add1 = functions.https.onRequest((request, response) => {
  console.log("41");

  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  const app = new DialogflowApp({request, response});
  const db = admin.database();

  function userForNumber (number) {
    console.log("userForNumber: " + number);
    return db.ref('users').orderByChild('number').equalTo(number)
      .once('value');
  }

  function userForName (name) {
    console.log("userForName: " + name);
    return db.ref('users').orderByChild('name').equalTo(name)
      .once('value');
  }

  function patientForNumber (number) {
    console.log("patientForNumber: " + number);
    return db.ref('patients').orderByChild('number').equalTo(number)
      .once('value');
  }

  function patientForName (name) {
    console.log("patientForName: " + name);
    return db.ref('patients').orderByChild('name').equalTo(name)
      .once('value');
  }

  function faceForName (name) {
    console.log("faceForName: " + name);
    console.log("faceForName typeof: " + typeof(name));
    console.log("faceForName Object: " + Object.prototype.toString.call(name));
    return db.ref('faces').orderByChild('name').equalTo(name)
      .once('value');
  }

  function faceForAny () {
    console.log("faceForAny");
    return db.ref('faces').once('value');
  }

  function responseHandlerAdd1Simple (app) {

    const event = app.getArgument('patient_event');

    const item = {
      timestamp: admin.database.ServerValue.TIMESTAMP,
      number: 0,
      event: event,
      user_id: 'u0',
      patient_id: 'p0',
      title: '',
      event_care: event,
      event_smile: '',
      timestamp_evented: admin.database.ServerValue.TIMESTAMP,
      timestamp_created: admin.database.ServerValue.TIMESTAMP,
      user_created: 'u0', };

    return admin.database().ref('memos').push(item).then(snapshot => {
      console.log("success.");
      app.tell(event + '、をメモしました。');
      }).catch((c2) => {
        console.log("c2");
      });
  }

  function responseHandlerMemo (app) {
    console.log('responseHandlerMemo');
    const patientName = app.getContextArgument('patientok', 'PatientNameExtend');
    const memoSaved = app.getContextArgument('memook', 'memo_saved');
    const memoAdded = app.getArgument('memo');
    const parameters = {};
    if (memoSaved) {
      console.log("memoSaved: " + memoSaved.value);
      console.log("memoAdded: " + memoAdded);
      parameters['memo_saved'] = memoSaved.value + '\n' + memoAdded;
    } else {
      console.log("memoAdded: " + memoAdded);
      parameters['memo_saved'] = memoAdded;
    }
    console.log(parameters['memo_saved']);
    app.setContext('memook', 10, parameters);
    app.ask(patientName.value + 'さんのケアログ、' + parameters['memo_saved'] +
      'を保存します。やり直しや追加があればどうぞ。');
  }

  function responseHandlerAdd2 (app) {

    const patientNameArg = app.getContextArgument('patientok', 'PatientNameExtend');
    const userNameArg = app.getContextArgument('staff', 'StaffName');
    const faceNameArg = app.getContextArgument('face', 'CareFace');
    const eventArg = app.getContextArgument('memook', 'memo_saved');
    const smileArg = app.getContextArgument('smile', 'smile');
    const titleArg = app.getContextArgument('title', 'title');

    var patientName = '不明';
    var userName = '不明';
    var faceNames = [];
    var event = '';
    var smile = '';
    var title = '';
    if (patientNameArg) { patientName = patientNameArg.value; }
    if (userNameArg) { userName = userNameArg.value; }
    if (faceNameArg) { faceNames = faceNameArg.value; }
    if (eventArg) { event = eventArg.value; }
    if (smileArg) { smile = smileArg.value; }
    if (titleArg) { title = titleArg.value; }

    console.log("patientName: " + patientName);
    console.log("userName: " + userName);
    console.log("faceNames: " + faceNames);
    console.log("event: " + event);
    console.log("smile: " + smile);
    console.log("title: " + title);

    const promisePid = patientForName(patientName);
    const promiseUid = userForName(userName);
    const promiseFid = faceForAny();
    const promiseAll = [promisePid, promiseUid, promiseFid];

    return Promise.all(promiseAll).then((snapshots) => {
      const patients = snapshots[0];
      const users = snapshots[1];
      const faces = snapshots[2];
      if (patients) {
        console.log("patients numChildren: " + patients.numChildren());
      } else {
        console.log("patients numChildren: " * '0');
      }
      if (users) {
        console.log("users numChildren: " + users.numChildren());
      } else {
        console.log("users numChildren: " + '0');
      }
      if (faces) {
        console.log("faces numChildren: " + faces.numChildren());
      } else {
        console.log("faces numChildren: " + '0');
      }
      var uid, user;
      var pid, patient;
      var fids = [];
      if (patients) { patients.forEach((p) => { pid = p.key; patient = p.val(); }); }
      if (users) { users.forEach((u) => { uid = u.key; user = u.val(); }); }
      faceNames.forEach((n) => {
        faces.forEach((f) => { if (n == f.val().name) { fids.push(f.key); }
        });
      });
      console.log("user uid: " + uid);
      console.log("patient pid: " + pid);
      console.log("face fids: " + fids);
      const item = {
        timestamp: admin.database.ServerValue.TIMESTAMP,
        number: patient ? patient.number : 0,
        event: event,
        user_id: uid ? uid : 'u0',
        patient_id: pid ? pid : 'p0',
        title: title,
        event_care: event,
        event_smile: smile,
        timestamp_evented: admin.database.ServerValue.TIMESTAMP,
        timestamp_created: admin.database.ServerValue.TIMESTAMP,
        user_created: uid ? uid : 'u0', };
      fids.forEach((fid) => { item[fid] = true; });
      return admin.database().ref('memos').push(item).then(snapshot => {
          console.log("success.");
          app.tell('保存しました。');
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

  function responseHandlerAdd1 (app) {

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
  actionMap.set('add1', responseHandlerAdd1Simple);
  actionMap.set('add2', responseHandlerAdd2);
  actionMap.set('memo', responseHandlerMemo);

  app.handleRequest(actionMap);
});

exports.onMemoWrite =
  functions.database.ref('/memos/{pushId}').onWrite(event => {
    const m = event.data.val();
    console.log('v16', event.params.pushId, m);
    if (event.data.exists()) {
      if (event.data.child('timestamp_evented').changed()) {
        const ut = m.user_id + "_" + m.timestamp_evented;
        console.log("Update user timestamp:", ut);
        const pt = m.patient_id + "_" + m.timestamp_evented;
        console.log("Update patient timestamp:", pt);
        let updates = {};
        updates['user_id_timestamp_evented'] = ut;
        updates['patient_id_timestamp_evented'] = pt;
        return event.data.ref.update(updates);
      } else if (event.data.child('user_id').changed()) {
        const ut = m.user_id + "_" + m.timestamp_evented;
        console.log("Update user timestamp:", ut);
        return event.data.ref.child('user_id_timestamp_evented').set(ut);
      } else if (event.data.child('patient_id').changed()) {
        const pt = m.patient_id + "_" + m.timestamp_evented;
        console.log("Update patient timestamp:", pt);
        return event.data.ref.child('patient_id_timestamp_evented').set(pt);
      }
    }
    return m;
  });
