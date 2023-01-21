import { Event } from "../types";

export default new Event("ready", () => {
    console.log("Bot is online");
});