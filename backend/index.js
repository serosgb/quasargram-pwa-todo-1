const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

/*
  Express configuration
*/
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;
      
/*
  Firebase configuration
*/
let serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();    

//

app.use(bodyParser.json());

/*
  Endpoints
*/

app.get('/api/todos', (request, response) => {
  console.log('api/todos called!')

  response.set('Access-Control-Allow-Origin', '*')
  let tasks = [];

  db.collection('tasks').orderBy('id','asc').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      tasks.push(doc.data());
    });
    
    response.send(tasks)
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
        

});

app.post('/api/todos', (request,response) => {
  response.set('Access-Control-Allow-Origin', '*');
  let fields = {
    id: request.query.id,
    title: request.query.title    
  };

  console.log('fields', fields)

  db.collection('tasks').doc(fields.id).set({
    id: parseInt(fields.id),
    title: fields.title,
  }).then(() => {
    response.send('Post added: ' + fields.id)
  });  
});

app.get('/', (req,res) => {
  res.send(`<h1>API Running on the port ${port}</h1>`);
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});