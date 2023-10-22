import { client } from '$services/redis';
import { genId } from  '$services/utils';
import { itemsKey, itemsByViewsKey, itemsByEndingAtKey } from '$services/keys';
import type { CreateItemAttrs } from '$services/types';
import { deserialize } from '$services/queries/items/deserialize';


export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemsKey(id));

    if (!Object.keys(item).length) {
        return null;
    }

    return deserialize(id, item);

};


export const getItems = async (ids: string[]) => {
    const commands = ids.map(id => client.hGetAll(itemsKey(id)));

    const items = await Promise.all(commands);

    return items.map((item, idx) => {
        if (!Object.keys(item).length) {
            return null;
        }

        return deserialize(ids[idx], item);
    });


};


export const createItem = async (attrs: CreateItemAttrs) => {
    const id = genId();

    await Promise.all([
        client.hSet(itemsKey(id), {
            ...attrs,
            createdAt: attrs.createdAt.toMillis(),
            endingAt: attrs.endingAt.toMillis(),
        }),
        client.zAdd(itemsByViewsKey(), {
                value: id,
                score: 0,
        }),
        client.zAdd(itemsByEndingAtKey(), {
            value: id,
            score: attrs.endingAt.toMillis(),
        }),
    ])

    return id;

};
