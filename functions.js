const{WebhookClient}=require('discord.js');
const{botGuild,prefix}=require('./config.json');
const{voice}=require("./channels.json");
const{log}=require('./webhooks.json');

exports.updateMemberSize=(client)=>{const guild=client.guilds.cache.get(botGuild);const allMembersChannel=client.channels.cache.get(voice.allMembers);const membersChannel=client.channels.cache.get(voice.members);const botsChannel=client.channels.cache.get(voice.bots);const members=guild.members.cache.filter(member=>!member.user.bot).size;allMembersChannel.setName(`All members: ${guild.memberCount}`);membersChannel.setName(`Members: ${members}`);botsChannel.setName(`Bots: ${guild.memberCount - members}`);}

exports.updateGuildAmount=(client)=>{const suffixes=["k","m","b"];const activities=["PLAYING","STREAMING","LISTENING","WATCHING"];const activity=activities[Math.floor(Math.random()*activities.length)];const url="http://twitch.tv/";let serverAmout=client.guilds.cache.array().length;let suffixUsed="";for(let suffix in suffixes){if (serverAmout>1000){serverAmout/=1000;suffixUsed=suffix;} else break;}serverAmout=`${serverAmout}${suffixUsed}`;if (activity=="PLAYING"||activity=="STREAMING"){serverAmout=`with ${serverAmout}`;}client.user.setActivity(`${serverAmout} guilds | ${prefix}help`,{type:activity,url:url});}

exports.sendGuildLog=(name, avatar, message)=>{const webhook=new WebhookClient(log.id,log.token);webhook.edit({name:name,avatar:avatar}).then(()=>{webhook.send(message);});}