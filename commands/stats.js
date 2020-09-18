const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  message.channel.send({embed: {
    color: client.config.embedColor,
    title: "Statistics",
    fields: [{
      name: "Mem Usage",
      value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      inline: true
    }, {
      name: "Uptime",
      value: duration,
      inline: true
    }, {
      name: "Users",
      value: client.users.size.toLocaleString(),
      inline: true
    }, {
      name: "Servers",
      value: client.guilds.size.toLocaleString(),
      inline: true
    }, {
      name: "Channels",
      value: client.channels.size.toLocaleString(),
      inline: true
    }, {
      name: "Discord.js",
      value: `v${version}`,
      inline: true
    }, {
      name: "Node",
      value: process.version,
      inline: true
    }]
  }});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: ":game_die: Miscelaneous",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
