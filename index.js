const Discord = require("discord.js");
const PREFIX = "-";

const chatfix = ""; 

var bot = new Discord.Client();

var util = [
    "-help Brings up this panel.",
    "-helpserver Get the invite to the help server.",
    "-userinfo @[tag] Get the info of a user.",
    "-invitebot Get the invite link for the bot"
];
var fun = [
    "-8ball Ask me any question, I shall answer!",
    "-say I will say what you ask me to say.",
    "-roll Roll a dice!",
    "-coinflip Flip a coin!"
];

var admincmds = [
    "-kick Kick a user that you mention -kick @[tag]",
    "-ban Ban a user thet you mention -ban @[tag], this is a dangerous command!",
    "-mute Mute a mentioned user -mute @[tag].",
    "-unmute Unmute a mentioned user -unmute @[tag].",
    "-warn Warn a user, for when a mute is too much  -warn @[tag].",
    "-unban Unban a user by their ID."
    //"-purge Purges x amount of messages, minimum of 2, maximum of 100 -underconstruction"
];

var predictions = [
    "Yes",
    "No",
    "Maybe",
    "Response cloudy ask later."
];

var coin = [
    "Heads",
    "Tails"
];

var servers = {};

bot.on("ready", function() {
    console.log("Bot is ready!");
    bot.user.setGame("Do -help for commands!");
});

bot.on("guildMemberAdd", function(member) {
    const welcome = new Discord.RichEmbed()
    .setTitle('Welcome Friend!!')
    .setTimestamp()
    .setColor(0x00FF00)
    .setFooter("Enjoy your time here!")
    member.send(welcome)
});

//Regular Command Table
bot.on("message", function(message) {
    let sender = message.author;

    if(!message.guild) return;

    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    let argu = message.content.split(" ").slice(1);

    switch (args[0].toLowerCase()) {
        case "invitebot":
            message.channel.send("https://discordapp.com/oauth2/authorize?client_id=371407159939956737&scope=bot&permissions=2146958591")
            break;
        case "unban":
            let adminban = message.guild.roles.find("name", "Administrator")
            let iduser = args.slice(1).join(' ');
            if(!message.member.roles.has(adminban.id)) {
                return message.reply("You don't have the role called: Administrator [Perms not found].");
            }
            if (iduser.length < 1) return message.reply('Please enter a user ID.');
            message.guild.unban(iduser);
                return message.reply("Unbanned: " + "<@"+iduser+">")
            break;
        case "unmute":
            let unmuted_role = message.guild.roles.find("name", "Muted")
            let muteadmin = message.guild.roles.find("name", "Administrator");
            if(!unmuted_role) {
                return message.reply("I couldn't find the role called: Muted");
            }
            if(!message.member.roles.has(muteadmin.id)) {
                return message.reply("You don't have the role called: Administrator [Perms not found].")
            }
            if(message.mentions.users.size == 0) {
                return message.reply("Please mention a user to unmute!")
            }
            let unmutemem = message.guild.member(message.mentions.users.first());
            if(!unmutemem) {
                return message.reply("That user doesn't exist..");
            }
            const unmutedm = new Discord.RichEmbed()
                .setTitle('You have been unmuted!')
                .setTimestamp()
                .setColor(0x00FF00)
                .addField('Moderator: ', message.author)
                .setFooter("Don't let it happen again!")
            message.mentions.users.first().send(unmutedm)
            unmutemem.removeRole(unmuted_role);
                return message.reply("Unmuted the user: " + message.mentions.users.first());
            break;
        case "warn":
            let canWarn = message.guild.roles.find("name", "Administrator");
            if(!message.member.roles.has(canWarn.id)) {
                return message.reply("You don't have the role called: Administrator [Perms not found.]");
            }
            let reason = args.slice(2).join(' ');
            let user = message.mentions.users.first();
            let modlog = message.guild.channels.find('name', 'mod-log');
            if(!modlog) return message.reply('I could not find a channel called: "mod-log" (cAsE sEnSiTiVe)');
            if (reason.length < 1) return message.reply('Please supply a reason for the warn!');
            if (message.mentions.users.size < 1) return message.reply('Please mention someone to warn!').catch(console.error);
            
            const warndm = new Discord.RichEmbed()
                .setTitle('You have been warned!')
                .setTimestamp()
                .setColor(0xFFA500)
                .addField('Reason: ', reason)
                .addField('Moderator: ', message.author)
                .setFooter("Don't let it happen again, this has been added to the servers logs!")
            message.mentions.users.first().send(warndm)
            
            const warnembed = new Discord.RichEmbed()
                .setTitle('Warn-Case')
                .setTimestamp()
                .setColor(0xFFA500)
                .addField('User Warned: ', message.mentions.users.first())
                .addField('Moderator: ', message.author)
                .addField('Reason: ', reason)
            return message.guild.channels.get(modlog.id).send(warnembed);
            break;
        case "coinflip":
            if (args[0]) message.channel.send(coin[Math.floor(Math.random() * coin.length)]);
            break;

        case "say":
            message.channel.send(argu.join(" "));
            break;

        case "8ball":
            if (args[1]) message.channel.send(predictions[Math.floor(Math.random() * predictions.length)]); 
            else message.channel.send("Please ask me a question..");
            break;

        case "help":
            var embed = new Discord.RichEmbed()
                .setAuthor("Guardian - Commands")
                .setColor(0x800080)
                .setFooter("Guardian by NulledRetry#5540 - V2 - Online!")
                .setThumbnail(message.author.avatarURL)
                .addField("----FUN COMMANDS----", fun, true)
                .addField("----ADMIN COMMANDS----", admincmds, true)
                .addField("----UTILITY----", util, true)
            message.channel.send(embed);
            break;

        case "kick":
            let modlog2 = message.guild.channels.find('name', 'mod-log');
            if(!modlog2) return message.reply('I could not find a channel called: "mod-log" (cAsE sEnSiTiVe)');
            let kickreason = args.slice(2).join(' ');
            if (kickreason.length < 1) return message.reply('Please supply a reason for the kick!');
            let modRole = message.guild.roles.find("name", "Administrator");
            if(!message.member.roles.has(modRole.id)) {
                return message.reply("You don't have the role called: Administrator [Perms not found.]")
            }
            if(message.mentions.users.size == 0) {
                return message.reply("Please mention a user to kick!");
            }
            let kickmem = message.guild.member(message.mentions.users.first());
            if(!kickmem) {
                return message.reply("That user doesn't exist..");
            }
            if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
                return message.reply("I do not have the permission Kick Members!");
            }
            kickmem.kick().then(member => {
                message.reply("Kicked the user " + member.user.username);
            });
            if (kickreason.length < 1) return message.reply('Please supply a reason for kicking the user!');
            const kickdm = new Discord.RichEmbed()
                .setTitle('You have been kicked!!')
                .setTimestamp()
                .setColor(0xFFA500)
                .addField('Reason: ', kickreason)
                .addField('Moderator: ', message.author)
            message.mentions.users.first().send(kickdm)
            const kickembed = new Discord.RichEmbed()
                .setTitle('Kick-Case')
                .setTimestamp()
                .setColor(0xFFA500)
                .addField('User Kicked: ', message.mentions.users.first())
                .addField('Moderator: ', message.author)
                .addField('Reason: ', kickreason)
            return message.guild.channels.get(modlog2.id).send(kickembed);
            break;

        case "ban":
            let modlog3 = message.guild.channels.find('name', 'mod-log');
            if(!modlog3) return message.reply('I could not find a channel called: "mod-log" (cAsE sEnSiTiVe)');
            let banreason = args.slice(2).join(' ');
            if (banreason.length < 1) return message.reply('Please supply a reason for the ban!');
            let banRole = message.guild.roles.find("name", "Administrator");
            if(!message.member.roles.has(banRole.id)) {
                return message.reply("You don't have the role called: Administrator [Perms not found.]")
            }
            if(message.mentions.users.size == 0) {
                return message.reply("Please mention a user to ban!");
            }
            let banmem = message.guild.member(message.mentions.users.first());
            if(!banmem) {
                return message.reply("That user doesn't exist..");
            }
            if(!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) {
                return message.reply("I do not have the permission ban Members!");
            }
            banmem.ban().then(member => {
                message.reply("Banned the user " + member.user.username);
            });
            if (banreason.length < 1) return message.reply('Please supply a reason for BANNING the user!');
            const bandm = new Discord.RichEmbed()
                .setTitle('You have been BANNED!!')
                .setTimestamp()
                .setColor(0xFF0000)
                .addField('Reason: ', banreason)
                .addField('Moderator: ', message.author)
                .setFooter('You had enough warnings, should of listened to them!')
            message.mentions.users.first().send(bandm)
            const banembed = new Discord.RichEmbed()
                .setTitle('Ban-Case')
                .setTimestamp()
                .setColor(0xFF0000)
                .addField('User Banned: ', message.mentions.users.first())
                .addField('Moderator: ', message.author)
                .addField('Reason: ', banreason)
            return message.guild.channels.get(modlog3.id).send(banembed);
            break;

        case "mute":
            let modlog4 = message.guild.channels.find('name', 'mod-log');
            if(!modlog4) return message.reply('I could not find a channel called: "mod-log" (cAsE sEnSiTiVe)');
            let mutereason = args.slice(2).join(' ');
            if (mutereason.length < 1) return message.reply('Please supply a reason to mute this user!');
            let muted = message.guild.roles.find("name", "Muted")
            let muteRole = message.guild.roles.find("name", "Administrator");
            if(!muted) {
                message.reply("I could not find the role called: Muted, I will now create the role..");
                message.member.guild.createRole({
                    name: "Muted",
                    permissions: []
                });
                break;
            }
            if(!message.member.roles.has(muteRole.id)) {
                return message.reply("You don't have the role called: Administrator [Perms not found.]");
            }
            if(message.mentions.users.size == 0) {
                return message.reply("Please mention a user to mute!");
            }
            let mutemem = message.guild.member(message.mentions.users.first());
            if(!mutemem) {
                return message.reply("That user doesn't exist..");
            }
            mutemem.addRole(muted);
            message.reply("Muted the user: " + message.mentions.users.first());
            const mutedm = new Discord.RichEmbed()
                .setTitle('You have been muted!!')
                .setTimestamp()
                .setColor(0xC0C0C0)
                .addField('Reason: ', mutereason)
                .addField('Moderator: ', message.author)
            message.mentions.users.first().send(mutedm)
            const muteembed = new Discord.RichEmbed()
                .setTitle('Mute-Case')
                .setTimestamp()
                .setColor(0xC0C0C0)
                .addField('User Muted: ', message.mentions.users.first())
                .addField('Moderator: ', message.author)
                .addField('Reason: ', mutereason)
            return message.guild.channels.get(modlog4.id).send(muteembed);
            break;
        case "roll":
            var di = Math.floor(Math.random() * 6) + 1;
            message.reply("You rolled a " + di)
            break;
        case "helpserver":
            return message.reply("Here is the help server! https://discord.gg/5HH3Yp6")
            break;
        case "userinfo":
            if(message.mentions.users.size == 0) {
                return message.reply("Mention a user to bring up information!");
            }
            let infomem = message.guild.member(message.mentions.users.first());
            if(!infomem) {
                return message.reply("The mentioned user does not exist!");
            }
            var embed = new Discord.RichEmbed()
            .setColor(0x800080)
            .setThumbnail(message.mentions.users.first().avatarURL, true)
            .addField("Username: ", message.mentions.users.first().username, true)
            .addField("Discriminator: ", message.mentions.users.first().discriminator, true)
            .addField("Bot user?", message.mentions.users.first().bot, true)
            .addField("Join date:", message.mentions.users.first().createdAt)
            .addField("Id:", message.mentions.users.first().id, true)
            message.channel.send(embed);
            break;
            
    }
});
