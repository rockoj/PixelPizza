const { createEmbed, sendEmbed, editEmbed, capitalize } = require('../functions'); 
const { blue, red } = require('../colors.json'); 
const { prefix } = require('../config.json'); 

module.exports = { 
    name: "help", 
    description: "list of all executable commands", 
    aliases: ['commands'], 
    minArgs: 0, 
    maxArgs: 1, 
    usage: "[command name]", 
    cooldown: 5, 
    userType: "all", 
    neededPerms: [], 
    removeExp: false, 
    needVip: false, 
    execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: blue,
            author: {
                name: message.author.username,
                icon: message.author.displayAvatarURL()
            },
            thumbnail: message.author.displayAvatarURL(),
            timestamp: true,
            footer: {
                text: client.user.username,
                icon: client.user.displayAvatarURL()
            }
        });
        let { commands, worker, teacher, staff, director } = message.client; 
        let executableCommands = commands.filter(command => command.userType == "all"); 
        if (worker) { 
            commands.filter(command => command.userType == "worker").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (teacher) { 
            commands.filter(command => command.userType == "teacher").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (staff) { 
            commands.filter(command => command.userType == "staff").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (director) { 
            commands.filter(command => command.userType == "director").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (!args.length) { 
            return message.author.send(editEmbed(embedMsg, {
                title: `**${capitalize(this.name)}**`,
                description: `\nYou can send '${prefix}${this.name} ${this.usage}' to get help for specific commands`,
                fields: [
                    {
                        name: 'all commands',
                        value: executableCommands.map(command => command.name).join(', ')
                    },
                    {
                        name: 'Commands amount',
                        value: executableCommands.size
                    }
                ]
            })).then(() => { 
                if (message.channel.type === "dm") return; 
                embedMsg.setDescription("I've sent you a DM with all commands"); 
            }).catch(error => { 
                console.error(`Could not send help DM to ${message.author.tag}.\n${error}`); 
                embedMsg.setColor(red).setDescription("I can't DM you. Do you have DMs disabled?"); 
            }).finally(() => { 
                embedMsg.fields = [];
                sendEmbed(embedMsg, message); 
            }); 
        } 
        const name = args[0].toLowerCase(); 
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name)); 
        if (!command) { 
            return sendEmbed(editEmbed(embedMsg, {
                color: red,
                description: `that's not an existing command!`
            }), message); 
        } 
        const executableCommand = executableCommands.get(name) || executableCommands.find(c => c.aliases && c.aliases.includes(name)); 
        if (!executableCommand) { 
            return sendEmbed(editEmbed(embedMsg, {
                color: red,
                description: `You need to be ${command.userType} to execute this command`
            }), message);
        } 
        embedMsg.setColor(blue).addField('**Name**', command.name); 
        if (command.aliases) embedMsg.addField('**Aliases**', command.aliases.join(', ')); 
        if (command.description) embedMsg.addField('**Description**', command.description); 
        if (command.usage) embedMsg.addField('**Usage**', `${prefix}${command.name} ${command.usage}`); 
        embedMsg.addField('**Cooldown**', `${command.cooldown || 0} second(s)`); 
        if (!client.canSendEmbeds) { 
            embedMsg = `Name: ${command.name}`; 
            if (command.aliases) embedMsg += `\nAliases: ${command.aliases.join(', ')}`; 
            if (command.description) embedMsg += `\nDescription: ${command.description}`; 
            if (command.usage) embedMsg += `\nUsage: ${prefix}${command.name} ${command.usage}`; 
            embedMsg += `\nCooldown: ${command.cooldown || 0} second(s)`; 
        } 
        message.channel.send(embedMsg); 
    } 
}