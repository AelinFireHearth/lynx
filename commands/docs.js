exports.run = async (client, message, query) => {
  if (!query.length) {
    return message.reply("fail");
  }
  const fetch = require("node-fetch");
  const qs = require("querystring");

  const SOURCES = ["stable", "master", "rpc", "commando", "akairo", "akairo-master", "11.5-dev", "collection"];

  const q = query;
  let source = query[0];
  if (SOURCES.includes(source)) {
    q.slice(1);
  } else {
    source = "stable";
  }
  if (source === "11.5-dev") {
    source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;
  }

  const queryString = qs.stringify({ src: source, q: q.join(" ") });
  const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryString}`);
  const embed = await res.json();
  if (!embed) {
    return message.reply("fail");
  }
  message.channel.send({ embed: embed });
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "docs",
  category: ":gear: System",
  description: "The discord.js docs.",
  usage: "docs"
};