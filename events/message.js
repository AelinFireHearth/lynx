// Chache for spam detection
const spam = {};

// Cache for mass ping detection
const ping = {};

// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Some sloppy spam detection.
  if (!spam[message.author.id]) spam[message.author.id] = [{}, {}, {}, {}];
  spam[message.author.id].push({
    content: message.content,
    time: Date.now()
  });
  if (spam[message.author.id].length > 4) spam[message.author.id].splice(0, 1);
  if (spam[message.author.id][0].content == spam[message.author.id][1].content && spam[message.author.id][0].content == spam[message.author.id][2].content && spam[message.author.id][0].content == spam[message.author.id][3].content) message.delete();
  if (spam[message.author.id][3].time - spam[message.author.id][0].time < 4000) message.delete();

  // Mass ping protection.
  ping[message.author.id] = ping[message.author.id] || 0;
  if (message.mentions.members.array().length >= 5) {
    ping[message.author.id] ++;
    if (ping[message.author.id] === 1) message.reply("don't mass ping people. Next time you will be muted!");
  }
  
  // We'll use the key often enough that simplifying it is worth the trouble.
  const key = `${message.guild.id}-${message.author.id}`;

  // Triggers on new users we haven't seen before.
  client.points.ensure(key, {
    user: message.author.id,
    guild: message.guild.id,
    points: 0,
    level: 0,
    cooldown: Date.now()
  });
  
  // Cooldown, so spamming doesn't give you tons of points.
  if (Date.now()-client.points.get(key, "cooldown")-60000 >= 0) {
    client.points.set(key, Date.now(), "cooldown");
    client.points.math(key, "add", Math.floor(Math.random()*10+15), "points");
  }

  // Get the users level and points.
  let lvl = client.points.get(key, "level");
  const points = client.points.get(key, "points");

  // Might put this in settings later.
  const roles = {
    1: "490015137517010944",
    5: "490014939138883596",
    10: "490016508500639745",
    20: "490019293434609674",
    30: "490019326653497344",
    40: "646188180822818866",
    50: "646203510815326208",
    60: "646221583928655872",
    70: "646228715407278091",
  };

  // The points you need for the next level.
  const nextLvl = lvl => 5*Math.pow(lvl, 2) + 50*lvl + 100;

  // Code is sloppy to use Mee6's formula. (5*(lvl^2) + 50*lvl + 100)
  let p = 0;
  for (let i = 0; i < lvl; i ++) {
    p += nextLvl(i);
  }

  // Act upon level up by sending a message and updating the user's level in enmap.
  if (points-p >= nextLvl(lvl)) {
    let plvl = lvl;
    lvl ++;
    while (plvl !== lvl) {
      plvl = lvl;
      p = 0;
      for (let i = 0; i < lvl; i ++) {
        p += nextLvl(i);
      }
      if (points-p >= nextLvl(lvl)) {
        lvl ++;
      }
    }
    // message.channel.send(`On declare of thy King, you, <@${message.author.id}>, have advanced to level ${lvl}!`);
    client.points.set(key, lvl, "level");
  }

  if (message.author.id === "359988404316012547" && message.guild.id === "423775032788123683") {
    // /*
    // Give the user a role if they have enough points.
    for (let a = 0, b = Object.keys(roles), member = message.guild.members.get(message.author.id); a < b.length; a ++) {
      if (lvl > b[a] && lvl < (b[a+1] || 1000)) {
        if (roles[b[a]]) {
          if (!member.roles.find(r => r.id === roles[b[a]])) {
            for (const i in roles) {
              if (member.roles.find(r => r.id === roles[i])) {
                await member.removeRole(roles[i]);
              }
            }
            await member.addRole(roles[b[a]]);
          }
        }
      }
    }
    // }
    // */
  }

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = message.settings = client.getSettings(message.guild);

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.fetchMember(message.author);

  // Check for then run emotes
  if (client.emotes.hasOwnProperty(command)) {
    const index = Math.floor(Math.random()*client.emotes[command].length);
    return message.channel.send({embed: {
      color: client.config.embedColor,
      title: `${command.toProperCase()} #${index+1}`,
      image: {
        url: client.emotes[command][index]
      }   
    }});
  }

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};
