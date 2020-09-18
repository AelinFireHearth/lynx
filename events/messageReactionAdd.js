// This event executes when someone reacts to a message.
module.exports = async (client, reaction, user) => {
  const reactionRole = client.reactionRoles.get(`${reaction.message.channel.id}-${reaction.message.id}-${reaction.emoji.toString()}`);
  if (!reactionRole) return;
  if (reaction.emoji.toString() === reactionRole.reaction) {
    if (reactionRole.blah != "true") {
      reaction.message.reactions.forEach(r => {
        if ((r.emoji.id || r.emoji.name) !== (reaction.emoji.id || reaction.emoji.name) && !user.bot) r.remove(user.id);
      });
    }
    reaction.message.guild.members.find(a => a.id === user.id).addRole(reactionRole.role);
  }
};
