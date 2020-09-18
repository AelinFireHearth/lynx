exports.run = async (client, message, [userId, ...reason], level) => { // eslint-disable-line no-unused-vars
  reason = reason.join(" ");
  if (!userId) return message.channel.send("Please specify a user");
  userId = userId.replace(/[^0-9]/g, "");
  const member = message.guild.members.get(userId);
  if (member === undefined) return message.channel.send(`Couldn't find a member with the id \`${userId}\``);
  if (!member.roles.find(r => r.id === "664135828313866250")) return message.channel.send("That user isn't muted");

  member.removeRole("664135828313866250");
  member.send({embed:{
    color: client.config.embedColor,
    title: `You have been unmuted in ${message.guild.name}` + (reason ? ` for "${reason}"` : "")
  }});
  member.addRole("664135828313866250");
  message.channel.send(`${member.user.tag} has been unmuted` + (reason ? ` for "  ${reason}"` : ""));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "unmute",
  category: ":hammer: Moderation",
  description: "Unmutes a user with a given reason.",
  usage: "unmute [reason]"
};
