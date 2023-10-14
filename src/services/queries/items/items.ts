import { client } from '$services/redis';
import { genId } from  '$services/utils';
import { itemKey } from '$services/keys';
import type { CreateItemAttrs } from '$services/types';
import { deserialize } from '$services/queries/items/deserialize';


export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemKey(id));

    if (!Object.keys(item).length) {
        return null;
    }

    return deserialize(id, item);

};


export const getItems = async (ids: string[]) => {
    const commands = ids.map(id => client.hGetAll(itemKey(id)));

    const items = await Promise.all(commands);

    return items.map((item, idx) => {
        if (!Object.keys(item).length) {
            return null;
        }

        return deserialize(ids[idx], item);
    });


};


export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    const id = genId();

    await client.hSet(itemKey(id), {
        ...attrs,
        createdAt: attrs.createdAt.toMillis(),
        endingAt: attrs.endingAt.toMillis(),
    });

    return id;

};
