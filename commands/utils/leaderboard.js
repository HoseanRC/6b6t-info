import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';

import https from "https";
import { addPoints, secondsToPeriod } from '../../utils.js';
import { getAverageColor } from 'fast-average-color-node';

const choices = [
    { name: "All", value: 0 },
    { name: "Top Playtime", value: 1 },
    { name: "Most Blocks Walked", value: 2 },
    { name: "Most Blocks Flied", value: 3 },
    { name: "Most Player Kills", value: 4 },
    { name: "Most Deaths", value: 5 },
    { name: "Most Joined", value: 6 },
    { name: "Most Jumped", value: 7 },
    { name: "Most Mob Kills", value: 8 },
    { name: "Most Netherrack Mined", value: 9 },
    { name: "Most TNT Placed", value: 10 },
    { name: "Most End Crystals Placed", value: 11 },
    { name: "Most Totems Popped", value: 12 },
    { name: "Most Cake Slices Eaten", value: 13 },
    { name: "Longets Time Since Death", value: 14 },
    { name: "Most Golden Hoe Crafted", value: 15 },
    { name: "Most Golden Apple Eaten", value: 16 }
];

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See the 6b6t leaderboards.')
    .addNumberOption(option =>
        option.setName('page')
            .setDescription('The page to show up')
            .setRequired(false)
            .setChoices(...choices));

/**
 * @param {CommandInteraction | ButtonInteraction} interaction 
 */
export async function execute(interaction) {
    if (!interaction.isButton()) {
        await interaction.deferReply();
    } else {
        await interaction.deferUpdate();
    }
    let page;
    if (!interaction.isButton()) {
        page = interaction.options.getNumber("page") ?? 0;
    } else {
        page = parseInt(interaction.customId.replace(/\D/g, ""));
    }
    https.get(`https://www.6b6t.org/_next/data/3178aa6f948ad9a592a38e79c7843c7d208881cd/en/stats.json`, function (res) {
        let data = "";
        res.on("data", a => { data = data.concat(a.toString()) });
        res.on("end", async function () {
            /**
             * @type {{
             * topPlaytime: {name: String, value: Number, playtime: Boolean}[],
             * topWalk: {name: String, value: Number}[],
             * topFly: {name: String, value: Number}[],
             * topPlayerKills: {name: String, value: Number}[],
             * topDeaths: {name: String, value: Number}[],
             * topJoin: {name: String, value: Number}[],
             * topJumps: {name: String, value: Number}[],
             * topMobKills: {name: String, value: Number}[],
             * topMineNetherRack: {name: String, value: Number}[],
             * topPlaceTNT: {name: String, value: Number}[],
             * topPlaceEndCrystal: {name: String, value: Number}[],
             * topUseTotem: {name: String, value: Number}[],
             * topCakeSlicesEaten: {name: String, value: Number}[],
             * topTimeSinceDeath: {name: String, value: Number}[],
             * topGoldenHoeCrafts: {name: String, value: Number}[],
             * topGoldenAppleEaten: {name: String, value: Number}[]
             * }|null}
             */
            let anarchyStats = JSON.parse(data.toString()).pageProps.anarchyStats;
            let embed = new EmbedBuilder();
            let ActionRows = [];
            if (page >= 1) {
                let info = Object.values(anarchyStats)[page - 1];
                embed = embed
                    .setTitle(`Leaderboard for ${choices[page].name.toLowerCase()}`)
                    .setThumbnail(`https://minotar.net/avatar/${info[0].name}/300.png`)
                    .setColor((await getAverageColor(`https://minotar.net/avatar/${info[0].name}/300.png`)).value.slice(0, 3))
                    .setDescription(
                        info.reduce((value, playerInfo, index, array) => `${value}#${index + 1} | \`${playerInfo.name}\` - **${[1, 14].includes(page) ? secondsToPeriod(playerInfo.value / 20) :
                            [6, 7, 9, 10, 11, 12].includes(page) ? `${addPoints(playerInfo.value)} times` :
                                addPoints(playerInfo.value)
                            }**${array.length - 1 == index ? "" : "\n"}`, ""));
                ActionRows[0] = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Previous Page")
                            .setEmoji('◀️')
                            .setCustomId(`leaderboard-page${page - 1 == 0 ? 16 : page - 1}`)
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setLabel("Main Page")
                            .setEmoji('📝')
                            .setCustomId(`leaderboard-page0`)
                            .setDisabled(page == 0)
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setLabel("Next Page")
                            .setEmoji('▶️')
                            .setCustomId(`leaderboard-page${page + 1 == 17 ? 1 : page + 1}`)
                            .setStyle(ButtonStyle.Secondary),
                    );
                ActionRows[1] = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("First Page")
                            .setEmoji('⏪')
                            .setCustomId(`leaderboard-page1x`)
                            .setDisabled(page == 1)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setLabel("Last Page")
                            .setEmoji('⏩')
                            .setCustomId(`leaderboard-page16x`)
                            .setDisabled(page == 16)
                            .setStyle(ButtonStyle.Success),
                    );
            } else {
                embed = embed
                    .setTitle("Leaderboards")
                    .setThumbnail("https://www.6b6t.org/icons/apple-icon-180x180.png")
                    .setColor((await getAverageColor("https://www.6b6t.org/icons/apple-icon-180x180.png")).value.slice(0, 3))
                    .setFields(...choices.reduce((value, info, index) => {
                        return [...(value.name ? [] : value), {
                            inline: true,
                            name: info.name,
                            value: `#1 | \`${Object.values(anarchyStats)[info.value - 1][0].name}\` - **${[1, 14].includes(info.value) ? secondsToPeriod(Object.values(anarchyStats)[info.value - 1][0].value / 20) :
                                [6, 7, 9, 10, 11, 12].includes(info.value) ? `${addPoints(Object.values(anarchyStats)[info.value - 1][0].value)} times` :
                                    addPoints(Object.values(anarchyStats)[info.value - 1][0].value)}**`
                        }]
                    }));
                ActionRows[0] = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("First Page")
                            .setEmoji('◀️')
                            .setCustomId(`leaderboard-page1`)
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setLabel("Main Page")
                            .setEmoji('📝')
                            .setCustomId(`leaderboard-page0`)
                            .setDisabled(page == 0)
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setLabel("Last Page")
                            .setEmoji('▶️')
                            .setCustomId(`leaderboard-page16`)
                            .setStyle(ButtonStyle.Secondary),
                    );
            }
            embed = embed
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setFooter({ text: `${page == 0 ? "Main " : ''}Page${page >= 1 ? ` ${page}/16` : ''}` })
                .setTimestamp();
            await interaction.editReply({ embeds: [embed], components: ActionRows });
        });
    });
}