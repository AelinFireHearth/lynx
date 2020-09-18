exports.run = async (client, message, [userId, ...reason], level) => { // eslint-disable-line no-unused-vars
  reason = reason.join(" ") || "no given reason";
  if (!userId) return message.channel.send("Please specify a user");
  userId = userId.replace(/[^0-9]/g, "");
  const member = message.guild.members.get(userId);
  if (member === undefined) return message.channel.send(`Couldn't find a member with the id \`${userId}\``);
  if (!member.bannable) return message.channel.send("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

  member.send({embed:{
    color: client.config.embedColor,
    title: `You were banned from ${message.guild.name} for "${reason}"`
  }});
  member.ban(reason);
  message.channel.send(`${member.user.tag} has been banned for "${reason}"`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "ban",
  category: ":hammer: Moderation",
  description: "Bans a user with a given reason.",
  usage: "ban @user [reason]"
};
