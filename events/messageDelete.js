module.exports = async (client, message) => {
  // Ignore bots.
  if (message.author.bot) return;

  // Load the guild's settings
  const settings = client.getSettings(message.guild);

  client.channels.find(c => c.name === settings.modLogChannel).send({embed: {
    color: 0xdd5f53,
    author: {
      name: `${message.author.username}#${message.author.discriminator}`,
      icon_url: message.author.avatarURL
    },
    title: `Message deleted in <#${message.channel.id}>`,
    description: message.content,
    footer: {
      text: `ID: ${message.author.id}`
    },
    timestamp: Date.now()
  }});
};
