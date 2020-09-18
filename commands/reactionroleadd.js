exports.run = async (client, message, [channelId, messageId, reaction, role, blah], level) => { // eslint-disable-line no-unused-vars
  // User must specify a valid channel.
  if (!channelId) return message.channel.send("Please specify a channel");
  channelId = channelId.replace(/[^0-9]/g, "");
  const channel = message.guild.channels.get(channelId);
  if (channel === undefined) return message.channel.send(`Couldn't find a channel with the id \`${channelId}\``);

  // User must specify a valid messageId.
  if (!messageId) return message.channel.send("Please specify a `messageId`");
  let msg;
  try {
    msg = await channel.fetchMessage(messageId);
  } catch (e) {
    return message.channel.send(`Couldn't find a message with the id \`${messageId}\``);
  }

  // User must specify a valid emoji.
  if (!reaction) return message.channel.send("Please specify an emoji");
  try {
    // client.emojis.get(reaction);
  } catch (e) {
    return message.channel.send(`Couldn't find an emoji with the id \`${messageId}\``);
  }

  // User must specify a valid role.
  if (!role) return message.channel.send("Please specify a role");
  role = role.replace(/[^0-9]/g, "");
  if (!message.guild.roles.get(role)) return message.channel.send(`Couldn't find a role with the id \`${role}\``);

  // TODO maybe check for previous "reactionRoles" with same key

  client.reactionRoles.ensure(`${channel.id}-${msg.id}-${reaction}`, {
    reaction: reaction,
    role: role,
    blah: blah,
    id: ~~(Math.random()*10000)
  });

  msg.react(~reaction.indexOf(":") ? reaction.replace(/[^0-9]/g, "") : reaction);

  message.channel.send({embed: {
    color: client.config.embedColor,
    description: `Created reaction role for the [message](https://discordapp.com/channels/${message.guild.id}/${channel.id}/${msg.id}) for the reaction (${reaction}) and the role (${message.guild.roles.get(role)})`
  }});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["reactionrolenew", "rrnew", "rradd"],
  permLevel: "Administrator"
};

exports.help = {
  name: "reactionroleadd",
  category: ":label: Reaction Roles",
  description: "Add a new reaction role.",
  usage: "reactionroleadd [#channel] [messageId] [:reaction:] [@role] [blah]* "
};
