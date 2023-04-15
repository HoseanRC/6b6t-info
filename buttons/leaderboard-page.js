import { ButtonInteraction } from "discord.js";
import { execute as commandExecute } from "../commands/utils/leaderboard.js";

export const data = {
    match: /^leaderboard-page\d*/g
};

/**
 * @param {ButtonInteraction} interaction 
 */
export async function execute(interaction, custom_id) {
    commandExecute(interaction);
}