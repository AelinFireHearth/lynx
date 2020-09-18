exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const user = message.mentions.users.first() || args[0] || message.author;
  if (!user) message.reply("fail");
  const key = `${message.guild.id}-${user.id}`;
  return message.channel.send(`You currently have ${client.points.get(key, "points")} points, and are level ${client.points.get(key, "level")}!`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["xp"],
  permLevel: "User"
};

exports.help = {
  name: "rank",
  category: ":arrow_up: Level",
  description: "Shows you your points.",
  usage: "rank"
};
