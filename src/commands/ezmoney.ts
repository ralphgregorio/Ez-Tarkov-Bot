import { Command } from "../types";
import { UseListTarkovItems } from '../queries'
import { Item } from "../__generated__/graphql";
import { ItemProfitability } from "../types";

export default new Command({
    name: "ezmoney",
    description: "Shows the top 5 items with the biggest flips",
    run: async ({ interaction }) => {
        const items = await UseListTarkovItems();
        const profitability: ItemProfitability[] = items.map( (item: Item) => {
            const sellTo = item.sellFor?.filter((sell) => sell.source !== "fleaMarket");
            if ( !item || !sellTo || !item.lastLowPrice || !item.sellFor) {
                return  {
                    name: 'N/A',
                    sellingSource: 'N/A',
                    basePrice: '0',
                    fleaPrice: '0',
                    fleaToTraderProfit: '0'
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
                fleaToTraderProfit: String(profit)
            }
        }).filter((item) => item.fleaToTraderProfit !== 'Infinity');

        const sortedItems = profitability.sort(function(a, b) {
            return parseFloat(b.fleaToTraderProfit) - parseFloat(a.fleaToTraderProfit);
        });

        let message = '-----------\n';
        let counter = 0;

        while (counter < 5) {
            message += `${counter+1}. \nItem Name: ${sortedItems[counter].name}
            Current Flea Price: ${sortedItems[counter].fleaPrice}
            Current Trader Price: ${sortedItems[counter].basePrice}
            Potential Profit (In Rubles) when selling to Trader: ${sortedItems[counter].fleaToTraderProfit}
            Trader to sell to: ${sortedItems[counter].sellingSource}\n-----------`;
            counter += 1;
        }

       
        interaction.followUp(message);
    }
});