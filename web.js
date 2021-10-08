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
   if (!index.data.check_channel(req.params.id)) {
     return res.redirect('/');
   }
   let skins_array = ["wikipedia","docs"];
   let skin = req.query.skin;
   if (skins_array.includes(skin)) {
     if (skin == "wikipedia") {
        let name = "cactus"
        res.render(skin+"/"+name,{id: req.params.id, title: "Cactus - Wikipedia"});
     } else if (skin == "docs") {
        let name = "docs"
        res.render(skin+"/"+name,{id: req.params.id, title: "Document Editor"});
     }   
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