import { Command } from "../types";

export default new Command({
    name: "ezmoney",
    description: "Shows the top 10 items with the biggest flips",
    run: async ({ interaction }) => {
        interaction.followUp("Pong3");
        console.log('Is this working?')
    }
});