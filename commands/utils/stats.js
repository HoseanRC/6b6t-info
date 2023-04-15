import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import https from "https";
import { addPoints, secondsToPeriod } from '../../utils.js';
import { getAverageColor } from 'fast-average-color-node';

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('See the stats of a player on 6b6t.')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('The player name')
            .setRequired(true));

/**
 * @param {CommandInteraction} interaction 
 */
export async function execute(interaction) {
    let startTime = new Date();
    let name = `${interaction.options.getString("name")}`;
    if (/^[a-zA-Z0-9_]{2,16}$/g.exec(name) == null) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setTitle("Invalid player name!")
                    .setDescription("please try again.")
                    .setColor(0xFF0000)
                    .setTimestamp()
            ],
            ephemeral: true
        });
    }
    https.get(`https://www.6b6t.org/_next/data/3178aa6f948ad9a592a38e79c7843c7d208881cd/en/stats/${name}.json`, function (res) {
        let data = "";
        res.on("data", a => { data = data.concat(a.toString()) });
        // interaction.deferReply();
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
            let userStats = JSON.parse(data.toString()).pageProps.userStats;
            if (!userStats)
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.tag,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setURL(`https://www.6b6t.org/stats/${name}`)
                            .setTitle(`No stats for ${name} found!`)
                            .setDescription("They may need to rejoin 6b6t to be tracked")
                            .setColor(0xFF0000)
                            .setTimestamp()
                    ]
                })
            else
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                            .setTitle(`${name}'s stats${userStats === null ? " doesn't exist!" : ""}`)
                            .setURL(`https://www.6b6t.org/stats/${name}`)
                            .setDescription(userStats === null ? `*Check if the bot is wrong:*\nhttps://www.6b6t.org/stats/${name}` : null)
                            .addFields({
                                name: 'Important Stats',
                                value: `Playtime - **${secondsToPeriod(userStats.playtime / 20)}**\n` +
                                    `First Played - **At ${new Date(userStats.firstPlayed).toISOString()
                                        .replaceAll("-", "/").replace("T", " ").replace(/\..*$/g, "")
                                    } ||${Math.floor((new Date() - new Date(userStats.firstPlayed)) / 86400000)} Days ago||**\n` +
                                    `Blocks Walked - **${addPoints(userStats.walk)}**\n` +
                                    `Blocks Flied - **${addPoints(userStats.fly)}**\n` +
                                    `Player Kills - **${addPoints(userStats.playerKills)}**\n` +
                                    `Deaths - **${addPoints(userStats.deaths)}**\n` +
                                    `K/D Ratio - **${addPoints((userStats.playerKills / userStats.deaths).toFixed(2))}**\n` +
                                    `\n` +
                                    `Totems Popped/Used - **${addPoints(userStats.useTotem)} times**\n` +
                                    `TNT Placed - **${addPoints(userStats.placeTNT)} times**\n` +
                                    `End Crystals Placed - **${addPoints(userStats.placeEndCrystal)} times**\n` +
                                    `Time Since Death - **${secondsToPeriod(userStats.timeSinceDeath / 20)}**`
                            },
                                {
                                    name: 'Other Stats',
                                    value: `Joined - **${addPoints(userStats.join)} times**\n` +
                                        `Jumped - **${addPoints(userStats.jumps)} times**\n` +
                                        `Mob Kills - **${addPoints(userStats.mobKills)}**\n` +
                                        `Netherrack Mined - **${addPoints(userStats.mineNetherRack)} times**\n` +
                                        `Cakes Eaten - **${addPoints(userStats.cakeSlicesEaten)}**\n` +
                                        `Golden Hoes Crafted - **${addPoints(userStats.goldenHoeCrafts)}**\n` +
                                        `Golden Apples Eaten - **${addPoints(userStats.goldenAppleEaten)}**`
                                })
                            .setColor((await getAverageColor(`https://minotar.net/avatar/${name}/300.png`)).value.slice(0, 3)/*Math.floor(Math.random() * 0x1000000)*/)
                            .setThumbnail(`https://minotar.net/avatar/${name}/300.png`)
                            .setFooter({ text: `Done in ${Math.floor((new Date() - startTime) / 10) / 100}s` })
                            .setTimestamp(),
                    ]
                });
        });
    });
}