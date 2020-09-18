// This event executes when someone unreacts to a message.
module.exports = async (client, reaction, user) => {
  const reactionRole = client.reactionRoles.get(`${reaction.message.channel.id}-${reaction.message.id}-${reaction.emoji.toString()}`);
  if (!reactionRole) return;
  if (reaction.emoji.toString() === reactionRole.reaction) return reaction.message.guild.members.find(a => a.id === user.id).removeRole(reactionRole.role);
};
