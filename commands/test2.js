exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const embed = new client.RichEmbed()
    .setTitle(`${message.guild.name}'s Nitro Giveaway`)
    .setDescription("Click the reaction below to enter the giveaway")
    .setColor(client.config.embedColor);
  message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "test2",
  category: ":game_die: Miscelaneous",
  description: "test2",
  usage: "test2"
};
