const{createEmbed,sendEmbed,getUser,inBotGuild}=require("../functions");
const{blue,red}=require('../colors.json');
const{setLevel}=require("../dbfunctions");

module.exports={
    name:"levelset",
    description:"set the level of a user",
    aliases:["setlevel"],
    args:true,
    minArgs:1,
    usage:"<amount> [user]",
    cooldown:0,
    userType:"director",
    neededPerms:[],
    pponly:true,
    removeExp:true,
    execute(message,args,client){
        let embedMsg=createEmbed(red,"**set level**",null,null,`${args[0]} is not a number`);
        if(isNaN(args[0]))return sendEmbed(embedMsg,message);
        if(parseInt(args[0])<0){
            embedMsg.setDescription(`The number can not be any lower than 0`);
            return sendEmbed(embedMsg,message);
        }
        const amount=args.shift();
        let user=message.author;
        if(args.length){
            user=getUser(message,args,client);
            if(!user){
                embedMsg.setDescription("User not found");
                return sendEmbed(embedMsg);
            }
        }
        if(!inBotGuild(client,user.id)){
            embedMsg.setDescription(`This user is not in Pixel Pizza`);
            return sendEmbed(embedMsg,message);
        }
        console.log(isNaN(amount));
        setLevel(client,user.id,amount);
        embedMsg.setColor(blue).setDescription(`level ${amount} has been set for ${user.tag}`);
        sendEmbed(embedMsg,message);
    }
}