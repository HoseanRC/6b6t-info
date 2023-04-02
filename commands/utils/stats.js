import { CommandInteraction, CommandInteractionOption, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import https from "https";

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Replies with player stats.')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('The player name')
            .setRequired(true));

/**
 * @param {CommandInteraction} interaction 
 */
export async function execute(interaction) {
    let name = `${interaction.options.getString("name")}`;
    if (/^[a-zA-Z0-9_]{2,16}$/g.exec(name) == null) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setTitle("Invalid player name!")
                    .setDescription("please try again.")
            ],
            ephemeral: true
        });
    }
    https.get(`https://www.6b6t.org/stats/${name}`, function (res) {
        let data = [];
        res.on("data", data.push);
        interaction.deferReply();
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${name}'s stats`)
                    .setURL(`https://www.6b6t.org/stats/${name}`)
                    .setDescription(
                        res.on("end", async function () {
                            let body = Buffer.concat(data).toString();
                            let table = /<tbody>(.*?)<\/tbody>/g.exec(body)[1];
                            let tableRows = table.match(/<tr>(.*?)<\/tr>/g);
                            tableRows.map(function (element) {
                                let tableColumns = element.split(/<\/?td>/g).filter(function (element) {
                                    if (element.match(/^<\/?tr>$/g) != null) return false;
                                    if (element.length == 0) return false;
                                    return true;
                                });
                                if (tableColumns[0] == "First Played") {
                                    tableColumns[1] += `||${Math.floor(((((Date.now() - Date.parse(tableColumns[1])) / 60) / 60) / 24) / 1000)} days ago||`;
                                    tableColumns[1] = "At " + tableColumns[1];
                                }
                                return tableColumns.join(" - ");
                            }).join("\n");
                        })
                    ),
            ]
        });
    });
}