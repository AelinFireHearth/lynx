exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  // Get a filtered list (for this guild only), and convert to an array while we're at it.
  const filtered = client.points.filter(p => p.guild === message.guild.id ).array();

  // Sort it to get the top results... well... at the top. Y'know.
  const sorted = filtered.sort((a, b) => b.points - a.points);

  // Slice it, dice it, get the top 10 of it!
  const top10 = sorted.splice(0, 10);

  // Now shake it and show it! (as a nice embed, too!)
  const embed = new client.RichEmbed()
    .setTitle(`${message.guild.name}'s Leaderboard`)
    .setDescription("Our top 10 points leaders.")
    .setColor(client.config.embedColor);
  for (const data of top10) {
    if (!client.users.get(data.user)) continue; // Ignore users that left the server.
    embed.addField(`**${client.users.get(data.user).username}**#${client.users.get(data.user).discriminator}`, `${data.points} points (level ${data.level})`);
  }
  return message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["lb"],
  permLevel: "User"
};

exports.help = {
  name: "leaderboard",
  category: ":arrow_up: Level",
  description: "Shows the top 10 users.",
  usage: "leaderboard"
};
  