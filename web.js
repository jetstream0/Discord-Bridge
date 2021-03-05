const pug = require('pug');

const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const index = require('./index.js');
const fs = require("fs");

app.use(express.static("site"));
app.set('view engine', 'pug');
app.set('views','./pug');


io.on('connection', socket => {
  socket.on('msg', msg => {
    index.data.send(msg.user, msg.msg, msg.id)
  });
  socket.on('check', check => {
    let c = index.data.check_channel(check.id);
    if (!c) {
    } else {
      io.to(socket.id).emit("check_confirm",{url: check.url});
      socket.join(c);
    }
  });
});

function choose(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}


app.get('/', (req, res) => {
  res.sendFile('/chat.html');
});

app.get('/chat/:id', function(req, res){
    let github = ["monero-project/monero: Monero: the secure, private, untraceable cryptocurrency","mcostalba/Stockfish: UCI chess engine","pallets/flask: The Python micro framework for building web applications.","searx/searx: Privacy-respecting metasearch engine","EFForg/privacybadger: Privacy Badger is a browser extension that automatically learns to block invisible trackers."]
    let wikipedia = ["Cactus - Wikipedia","42 (number) - Wikipedia","Segmentation fault - Wikipedia"]
    let docs = ["Don't Panic - Google Docs","Koala Research Project - Google Docs","Google Privacy Violations - Google Docs","How to Eat Cheese - Google Docs","Nuclear Codes - Google Docs","Frederick the Great 2024 - Google Docs","Meta Thematic Metaphorical Haiku Literary Analysis of Ironic Virtue Allegories in Shakepeare's King Romeo's Midsummer Night Tempest - Google Docs"]
   if (!index.data.check_channel(req.params.id)) {
     return res.redirect('/');
   }
   let skins_array = ["wikipedia"];
   let skin = req.query.skin;
   if (skins_array.includes(skin)) {
     let page = "";
     let name = "";
     if (skin == "wikipedia") {
       //page = choose(wikipedia);
       page = "Cactus - Wikipedia";
       if (page == "Cactus - Wikipedia") {
         name = "cactus";
       } else if (page == "42 (number) - Wikipedia") {
         content = "";
       } else if (page == "Segmentation fault - Wikipedia") {
         content = "";
       }
     }
     res.render(skin+"/"+name,{id: req.params.id, title: page});
   } else {
     res.render('chat',{id: req.params.id});
   }
});

http.listen(3000, () => {
  console.log('Started');
});

module.exports.data = {
  emit: function (name,load) {
    io.emit(name,load)
  }
}