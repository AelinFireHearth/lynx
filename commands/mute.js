exports.run = async (client, message, [userId, time, ...reason], level) => { // eslint-disable-line no-unused-vars
  if (!userId) return message.channel.send("Please specify a user");
  userId = userId.replace(/[^0-9]/g, "");
  const member = message.guild.members.get(userId);
  if (member === undefined) return message.channel.send(`Couldn't find a member with the id \`${userId}\``);
  if (member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("I cannot kick this user!?");

  if (!time || !client.ms(time)) {
    if (time) reason = time + " " + reason;
    time = "";
  }
  reason = reason.join(" ") || "no given reason";

  member.send({embed:{
    color: client.config.embedColor,
    title: `You have been muted in ${message.guild.name} for \`${time||"no given time"}\` because "${reason}"`
  }});
  member.addRole("664135828313866250");
  message.channel.send(`${member.user.tag} has been muted for \`${time||"no given time"}\` because "${reason}"`);
  if (time) {
    setTimeout(function() {
      member.removeRole("664135828313866250");
      message.channel.send(`${member.user.tag} has been unmuted!`);
    }, client.ms(time));
  } 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "mute",
  category: ":hammer: Moderation",
  description: "Mutes a user for a certain amount of time with a given reason.",
  usage: "mute @user [time] [reason]"
};
