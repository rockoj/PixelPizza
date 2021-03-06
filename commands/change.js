const { MessageAttachment } = require('discord.js');
const { createEmbed, hasRole, sendEmbed, editEmbed, isImage } = require("../functions");
const { red, green } = require('../colors.json');
const { cook } = require('../roles.json');
const { query } = require("../dbfunctions");
const { text } = require('../channels.json');

module.exports = {
    name: "change",
    description: "change the image of a cooking or cooked order",
    args: true,
    minArgs: 1,
    maxArgs: 2,
    usage: "<order id> <image | image link>",
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red,
            title: "change image"
        });
        if (!hasRole(client.member, cook)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have the ${client.guild.roles.cache.get(cook).name} role in ${client.guild.name} to be able to claim an order`
            }), message);
        }
        if (message.attachments.array().length > 1) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `There are too many attachments! please send only one image with the message!`
            }), message);
        }
        let results = await query(
            "SELECT * \
            FROM `order` \
            WHERE orderId = ? AND status IN('cooking','cooked')",
            [args[0]]
        );
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the cooking or cooked status`
            }), message);
        }
        if (results[0].cookId != message.author.id) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `The image of the order can only be changed by the cook who claimed it`
            }), message);
        }
        const url = message.attachments.first()?.url || args[1];
        if (!isImage(url)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This link is invalid`
            }), message);
        }
        client.channels.cache.get(text.images).send(new MessageAttachment(url)).then(msg => {
            query(
                "UPDATE `order` \
                SET imageUrl = ? \
                WHERE orderId = ?",
                [msg.attachments.first().url, args[0]]
            );
            sendEmbed(editEmbed(embedMsg, {
                color: green,
                description: `The image of the order has been changed`
            }), message);
        });
    }
}