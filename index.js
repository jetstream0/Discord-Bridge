const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require("fs");

const web = require('./web.js');

const {token} = process.env;

client.on('ready', () => {
	console.log('Ready!');
  client.user.setActivity('https://discord-proxy.prussia.dev', { type: 'PLAYING' });
});

client.on('message', async message => {
  let data = fs.readFileSync('last_id.txt');
  if (data.toString() == message.id) {
    return
  }
  fs.writeFileSync('last_id.txt', message.id);
  web.data.emit("d_msg",{user: message.author.username, content: message.content, id: message.channel.id});
});

client.login(token);

module.exports.data = {
  send: function (username, message, id) {
    let channel = client.channels.cache.get(id);
    if (!channel) {
      return
    }
    channel.send("**"+username+": **"+message);
  },
  check_channel: function (channel_id) {
    if (!client.channels.cache.get(channel_id)) {
      return false
    }
    return channel_id;
  }
}