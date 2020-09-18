// This event executes when a new member joins a server. Let's welcome them!

module.exports = async (client, member) => {
  // Load the guild's settings
  const settings = client.getSettings(member.guild);

  // If welcome is off, don't proceed (don't welcome the user)
  if (settings.welcomeEnabled !== "true") return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = {embed: {
    color: client.config.embedColor,
    author: {
      name: `Greetings ${member.user.tag}, welcome to Kingdom of Terrasen!`,
      icon_url: member.user.avatarURL
    },
    title: "**Check these out first**",
    description: `<#546977355105566720> *for the **Rules***
<#546973800793767936> *for the **Roles***
<#546990128581574656> *to **Introduce** yourself*`,
    image: {
      "url": "https://media.discordapp.net/attachments/701714216351956992/701714346274979881/TerrasenNewWelcome.png"
    }
  }}; // Hard coded for now lol.

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  member.guild.channels.find(c => c.name === settings.welcomeChannel).send(welcomeMessage).catch(console.error);
  
  // Made on mobile lol
  await member.addRole("432903271066107905");
  await member.addRole("664132205173538816");
  await member.addRole("687337741591248937");

  // Hard coded membercount
  if (member.guild.id !== "423775032788123683") return;
  client.channels.get("706095961071550485").edit({ name: "Member Count: " + member.guild.memberCount });
};
