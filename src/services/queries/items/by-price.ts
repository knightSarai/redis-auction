import { itemsKey, itemsPriceKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from ".";

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
    let results: any = await client.sort(itemsPriceKey(), {
        GET: [
            '#',
            `${itemsKey('*')}->name`,
            `${itemsKey('*')}->views`,
            `${itemsKey('*')}->price`,
            `${itemsKey('*')}->imageUrl`,
            `${itemsKey('*')}->endingAt`,
            `${itemsKey('*')}->createdAt`,
        ],

        BY: 'nosort',
        DIRECTION: order,
        LIMIT: {
            offset,
            count
        }
    })

    const items = [];
    for (let i = 0; i < results.length; i+=7) {
        items.push(deserialize(results[i], {
            name: results[i + 1],
            views: results[i + 2],
            price: results[i + 3],
            imageUrl: results[i + 4],
            endingAt: results[i + 5],
            createdAt: results[i + 6],
            
        }))
    }

    return items

};
