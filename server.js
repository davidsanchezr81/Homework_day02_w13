const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/public'));


const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect( //esto te conecta con el DB // aqui se coloca una URL
  'mongodb://localhost:27017',// ya que es asincronizada, se usa un call back
  function(err, client){ // se coloca "err" por si hay un error
    if(err){
      console.error(err); // si hay error, despliega el error
      return;
  }
    const db = client.db('star_wars'); // sino despliega la DB

    console.log('Connected to DB');

    const quotesCollection = db.collection('quotes'); // esto es para poder accesar a un nivel mas bajo dentro de la DB

    //CREATE
    server.post('/api/quotes', function(req, res){
      const newQuote = req.body;// este es el request object

      quotesCollection.save(newQuote, function(err, result){ //. esta funcion dira cuando el elemento esta salvado en la DB
        if(err){
          console.error(err);
          res.status(500)// esta es la respuesta que recibe el cliente al haber un error en el server
          res.send();
          return;
        }
        console.log('Saved');
        res.status(201); // 201 significa CREATED
        res.json(result.ops[0]);
      });
    });

    //INDEX
    server.get('/api/quotes', function(req, res){
      quotesCollection.find().toArray(function(err, allQuotes){
        if(err){
          console.error(err);
          res.status(500)// esta es la respuesta que recibe el cliente al haber un error en el server
          res.send();
          return; // este return pertenece a la callback function "function(err, allQuotes)"
        }

          res.json(allQuotes);

      });
    })


    //FIND ONE
    server.get('/api/quotes/:id', function(req, res){

      const id = req.params.id;
      const objectID = ObjectID(id)

      quotesCollection.findOne({_id: objectID},function(err, aQuotes){
        if(err){
          console.error(err);
          res.status(500)// esta es la respuesta que recibe el cliente al haber un error en el server
          res.send();
          return; // este return pertenece a la callback function "function(err, allQuotes)"
        }

          res.json(aQuotes);

      });
    })

    //DELETE ALL - DESTROY ALL
    server.delete('/api/quotes', function(req, res){
      // quotesCollection.deleteMany({}, function(){ // Para eliminar uno se usa este, colocandole el elemento entre las llaves
      // quotesCollection.deleteMany(null, function(){ //PUEDE HACERSER DE CUALQUIERA DE ESTA MANERA
      quotesCollection.deleteMany(function(err, result){
        if(err){
          console.error(err);
          res.status(500)// esta es la respuesta que recibe el cliente al haber un error en el server
          res.send();
          return; // este return pertenece a la callback function "function(err, allQuotes)"
        }

        res.send();

      });

    })



    /////////////////////DELETE ONE - DESTROY ONE ///////////////////
    server.delete('/api/quotes/:id', function(req, res){

      const id = req.params.id;
      const objectID = ObjectID(id)

      quotesCollection.deleteMany({_id: objectID}, function(err, result){
        if(err){
          console.error(err);
          res.status(500)
          res.send();
          return;
        }

        res.send();

      });

    })



    // UPDATE
    server.put('/api/quotes/:id', function(req, res){

      const updatedQuote = req.body; // esta es la nueva data que el cliente envia en el request para ser cambiada

      const id = req.params.id;

      const objectID = ObjectID(id)

      quotesCollection.update({_id: objectID}, updatedQuote, function(err, result){
        if(err){
          console.error(err);
          res.status(500)// esta es la respuesta que recibe el cliente al haber un error en el server
          res.send();
          return; // este return pertenece a la callback function "function(err, allQuotes)"
        }

        res.send(result);
      })


    });






    server.listen(3000, function(){
      console.log("Listening on port 3000");
    });

  }
);
