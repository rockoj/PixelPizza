const { createEmbed, sendEmbed, editEmbed, capitalize } = require("../functions"); 
const { query } = require("../dbfunctions"); 
const { blue, red } = require('../colors.json'); 
const { statuses } = require('../config.json');

module.exports = { 
    name: "orders", 
    description: "show all orders", 
    minArgs: 0, 
    usage: "<status>", 
    cooldown: 0, 
    userType: "worker", 
    neededPerms: [], 
    pponly: false, 
    async execute(message, args, client) { 
        const status = args?.join(" ");
        let embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`
        });
        let results; 
        if (!args.length) { 
            results = await query("SELECT orderId FROM `order` WHERE status NOT IN('deleted','delivered')"); 
        } else if (!statuses.orders.includes(status)) { 
            embedMsg = editEmbed(embedMsg, {
                description: `${status} is not a valid status`,
                fields: [
                    {name: "Statuses", value: statuses.orders.join(", ")}
                ]
            });
            if (!client.canSendEmbeds) embedMsg = `${embedMsg.description}\n\n${embedMsg.fields[0].name}\n${embedMsg.fields[0].value}`; 
            return message.channel.send(embedMsg); 
        } else { 
            results = await query("SELECT orderId FROM `order` WHERE status = ?", [status]); 
        } 
        let ordersString = results.length ? "`" : "no orders have been found"; 
        for (let i in results) { 
            let result = results[i]; 
            ordersString += result.orderId; 
            if (i == results.length - 1) { 
                ordersString += "`"; 
            } else { 
                ordersString += ", "; 
            } 
        } 
        sendEmbed(editEmbed(embedMsg, {
            color: blue,
            description: ordersString
        }), message); 
    } 
}