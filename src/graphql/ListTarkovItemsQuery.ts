import { gql } from '@apollo/client/core';

export const LIST_TARKOV_ITEMS_QUERY: any = gql(`
    query getPrices($itemsId: [ID]) {
        items(ids: $itemsId) {
            id
            name
            lastLowPrice
            avg24hPrice
            basePrice
            image8xLink
            sellFor {
                priceRUB
                price
                source
                currency
            }
        }
    }
`);