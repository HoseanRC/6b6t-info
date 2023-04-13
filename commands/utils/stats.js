import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import https from "https";
import { secondsToPeriod } from '../../utils';
import { getAverageColor } from 'fast-average-color-node';

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
    https.get(`https://www.6b6t.org/_next/data/ddf2b40d01eedecbc17b4827a6c34be2d707022c/en/stats/${name}.json`, function (res) {
        let data = [];
        res.on("data", data.push);
        interaction.deferReply();
        res.on("end", async function () {
            /**
             * @type {{
             * playtime: Number,
             * firstPlayed: Number,
             * walk: Number,
             * fly: Number,
             * playerKills: Number,
             * deaths: Number,
             * join: Number,
             * jumps: Number,
             * mobKills: Number,
             * mineNetherRack: Number,
             * placeTNT: Number,
             * placeEndCrystal: Number,
             * useTotem: Number,
             * cakeSlicesEaten: Number,
             * timeSinceDeath: Number,
             * goldenHoeCrafts: Number,
             * goldenAppleEaten: Number
             * }|null}
             */
            let userStats = JSON.parse(Buffer.from(data).toString()).pageProps.userStats;
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                        .setTitle(`${name}'s stats${userStats === null ? " doesn't exist!" : ""}`)
                        .setURL(`https://www.6b6t.org/stats/${name}`)
                        .setDescription(userStats === null ? `*Check if the bot is wrong:*\nhttps://www.6b6t.org/stats/${name}` : null)
                        .addFields({
                            name: 'Important Stats',
                            value: `Playtime - **${secondsToPeriod(userStats.playtime)}**\n` +
                                `First Played - **At ${new Date(userStats.firstPlayed).toISOString()
                                    .replace("-", "/").replace("T", " ").replace(/\..*$/g, "")
                                } ||<t:${userStats.firstPlayed / 1000}:R>||**\n` +
                                `Blocks Walked - **${userStats.walk}**\n` +
                                `Blocks Flied - **${userStats.fly}**\n` +
                                `Player Kills - **${userStats.playerKills}**\n` +
                                `Deaths - **${userStats.deaths}**\n` +
                                `K/D Ratio - **${(userStats.playerKills / userStats.deaths).toFixed(2)}**\n` +
                                `\n` +
                                `Totems Popped/Used - **${userStats.useTotem} times**\n` +
                                `TNT Placed - **${userStats.placeTNT} times**\n` +
                                `End Crystals Placed - **${userStats.placeEndCrystal} times**\n` +
                                `Time Since Death - **${secondsToPeriod(userStats.timeSinceDeath / 20)}**`
                        },
                        {
                            name: 'Other Stats',
                            value: `Joined - **${userStats.join} times**\n` +
                                `Jumped - **${userStats.join} times**\n` +
                                `Mob Kills - **${userStats.join}**\n` +
                                `Netherrack Mined - **${userStats.join} times**\n` +
                                `Cakes Eaten - **${userStats.join}**\n` +
                                `Golden Hoes Crafted - **${userStats.join}**\n` +
                                `Golden Apples Eaten - **${userStats.join}**`
                        })
                        .setColor((await getAverageColor(`https://www.6b6t.org/stats/${name}`)).value.pop()/*Math.floor(Math.random() * 0x1000000)*/)
                        .setThumbnail(`https://minotar.net/avatar/${name}/300.png`)
                        .setFooter({text: `Done in ${Math.floor((new Date().getMilliseconds() - interaction.createdAt.getMilliseconds()) / 10) / 100}s`})
                        .setTimestamp(),
                ]
            });
        });
    });
}