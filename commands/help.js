/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/

exports.run = (client, message, args, level) => {
  // If no specific command is called, show all filtered commands.
  if (!args[0]) {
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    let currentCategory = "";
    const embed = new client.RichEmbed()
      .setTitle("Command list")
      .setDescription(`[Use ${message.settings.prefix}help <command_name> for details]`)
      .setColor(client.config.embedColor);
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    const values = [];
    sorted.forEach( c => {
      const cat = c.help.category;
      if (currentCategory !== cat) {
        if (values.length) embed.addField(`${currentCategory}`, `\`${values.join("` `")}\``);
        values.splice(0, values.length);
        currentCategory = cat;
      }
      values.push(`${c.help.name}`);
    });
    if (values.length) embed.addField(`${currentCategory}`, `\`${values.join("` `")}\``);
    const emotes = Object.keys(client.emotes);
    if (emotes.length) embed.addField(":performing_arts: Emotes", `\`${emotes.join("` `")}\``);
    message.channel.send(embed);
  } else {
    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command) || client.aliases.has(command)) {
      command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
      if (level < client.levelCache[command.conf.permLevel]) return;
      const embed = new client.RichEmbed()
        .setTitle(command.help.name.toProperCase())
        .setDescription(command.help.description)
        .setColor(client.config.embedColor)
        .addField("Usage", `\`${command.help.usage}\``);
      if (command.conf.aliases.length) {
        embed.addField("Aliases", `\`${command.conf.aliases.join("` `")}\``);
      }
      message.channel.send(embed);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: ":gear: System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
