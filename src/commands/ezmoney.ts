import { Command } from "../types";
import { UseListTarkovItems } from '../queries'
import { Item } from "../__generated__/graphql";
import { ItemProfitability } from "../types";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default new Command({
    name: "ezmoney",
    description: "Shows the top 5 items with the biggest flips",
    run: async ({ interaction }) => {
        const items = await UseListTarkovItems();
        const profitability: ItemProfitability[] = items.map( (item: Item) => {
            const sellTo = item.sellFor?.filter((sell) => sell.source !== "fleaMarket");
            if ( !item || !sellTo || !item.lastLowPrice || !item.sellFor) {
                return  {
                    name: item?.name,
                    sellingSource: 'N/A',
                    basePrice: '0',
                    fleaPrice: '0',
                    fleaToTraderProfit: '0',
                    traderSellPrice: '0',
                    imageUrl: ''
                }
            }
            const biggestTraderSellValue = Math.max(...sellTo.map(sell => Number(sell.priceRUB)))
            const profit = item.lastLowPrice ? biggestTraderSellValue - item.lastLowPrice: 0;
            const trader = item.sellFor.find((seller) => seller.priceRUB === biggestTraderSellValue);
            return {
                name: item.name,
                sellingSource: trader?.source,
                basePrice: String(item.basePrice),
                fleaPrice: String(item.lastLowPrice),
                fleaToTraderProfit: String(profit),
                traderSellPrice: String(biggestTraderSellValue),
                imageUrl: item.image8xLink
            }
        }).filter((item) => item.sellingSource !== 'N/A');

        const sortedItems = profitability.sort(function(a, b) {
            return parseFloat(b.fleaToTraderProfit) - parseFloat(a.fleaToTraderProfit);
        });

        let message = '-----------\n';
        let counter = 0;

        while (counter < 5) {
            const row: any = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setCustomId('one')
					.setLabel(`Lowest Flea Price: ₽ ${sortedItems[counter].fleaPrice}`)
					.setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('two')
                    .setLabel(`Trader Sell Price: ₽ ${sortedItems[counter].traderSellPrice}`)
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('three')
                    .setLabel(`Profit: ₽ ${sortedItems[counter].fleaToTraderProfit}`)
                    .setStyle(ButtonStyle.Primary)
			);
            const embed = new EmbedBuilder()
                .setColor(0x5af506)
                .setTitle(`Item Name: ${sortedItems[counter].name}`)
                .setDescription(`Buy from Trader: ₽ ${sortedItems[counter].basePrice}`)
                .addFields( 
                    { name: 'Lowest Flea Price:', value: `₽ ${sortedItems[counter].fleaPrice}`},
                    { name: 'TRADER SELL Price:', value: `₽ ${sortedItems[counter].traderSellPrice}`, inline: true},
                    { 
                        name: `Potential Profit selling to Trader: ₽ ${sortedItems[counter].fleaToTraderProfit}`, 
                        value: `Trader to sell to: ${sortedItems[counter].sellingSource}`
                    }
                )
                .setFooter({ text: 'Refreshes every 5 minutes'})
                .setThumbnail(String(sortedItems[counter].imageUrl))
                .setTimestamp()
                
            interaction.followUp({ embeds: [embed], components: [row] });
            counter += 1;
        }
    }
});