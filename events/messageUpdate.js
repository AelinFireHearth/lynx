module.exports = async (client, message, newMessage) => {
  // Ignore bots.
  if (message.author.bot) return;

  // Load the guild's settings
  const settings = client.getSettings(message.guild);

  client.channels.find(c => c.name === settings.modLogChannel).send({embed: {
    color: client.config.embedColor,
    author: {
      name: `${message.author.username}#${message.author.discriminator}`,
      icon_url: message.author.avatarURL
    },
    title: `Message edited in <#${message.channel.id}>`,
    description: `**Before: **${message.content}\n**After: **${newMessage.content}`,
    footer: {
      text: `ID: ${message.author.id}`
    },
    timestamp: Date.now()
  }});
};
