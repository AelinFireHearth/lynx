// This event executes when a member leaves a server. (Just copied guildMemberAdd for now)

module.exports = (client, member) => {
  // Load the guild's settings
  const settings = client.getSettings(member.guild);

  // If welcome is off, don't proceed (don't welcome the user)
  if (settings.welcomeEnabled !== "true") return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = {embed: {
    color: client.config.embedColor,
    title: `Looks like **${member.user.tag}**  decided to leave this Kingdom... Farewell!`,
  }}; // Hard coded for now lol.

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  member.guild.channels.find(c => c.name === settings.welcomeChannel).send(welcomeMessage).catch(console.error);

  // Hard coded membercount
  if (member.guild.id !== "423775032788123683") return;
  client.channels.get("706095961071550485").edit({ name: "Member Count: " + member.guild.memberCount });
};
