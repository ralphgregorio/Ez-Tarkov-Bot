import { gql } from '@apollo/client/core';

export const LIST_TARKOV_ITEMS_QUERY: any = gql(`
    query getPrices($itemsId: [ID]) {
        items(ids: $itemsId) {
            id
            name
            lastLowPrice
            basePrice
            sellFor {
                priceRUB
                price
                source
                currency
            }
        }
    }
`);