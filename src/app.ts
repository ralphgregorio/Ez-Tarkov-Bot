import 'dotenv/config';
import { ExtendedClient } from "./types/Client";

export const client = new ExtendedClient();

client.start();