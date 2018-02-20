'use strict';

process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.add1 = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  function responseHandlerAdd1 (app) {
    let number = app.getArgument('patient_number');
    let event = app.getArgument('patient_event');
    return admin.database().ref('memos').push(
      { timestamp: admin.database.ServerValue.TIMESTAMP, number: number, event: event})
      .then(snapshot => {
        app.tell('患者さん' + number + '番の出来事、' + event + '、をメモしました。');
    });
  }

  const actionMap = new Map();
  actionMap.set('add1', responseHandlerAdd1);

  app.handleRequest(actionMap);
});
