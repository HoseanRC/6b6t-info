import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('The help command.');

/**
 * @param {CommandInteraction} interaction 
 */
export async function execute(interaction) {
    let embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setTitle("Bot commands")
        .setDescription(
            interaction.client.commands
                .map(element => `\`/${element.data.name}\` - **${element.data.description}**`)
                .join("\n")
        )
        .setColor(0xFFFFFF)
        .addFields(
            {name: 'Stats not updating', value: "*If your player stats don't update, rejoin 6b6t and try again (Or check the [site](https://www.6b6t.org/stats))*"}
        )
        .setFooter({ text: "Made by HoseanRC - 501025552816275483" });
    interaction.reply({ embeds: [embed] });
}