import { apolloClient } from '../graphql'
import { LIST_TARKOV_ITEMS_QUERY } from '../graphql/ListTarkovItemsQuery';
import { Item } from '../__generated__/graphql';

export const UseListTarkovItems = async (
    items = [] 
): Promise<Array<Item>> => {
    return await apolloClient.query({
        query: LIST_TARKOV_ITEMS_QUERY,
        variables: {
            items: items
        }
    })
    .then((result) => {return result.data?.items});
};