import { client } from '$services/redis';
import { itemsKey, itemsByViewsKey, itemsViewsKeys } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
    const firstView = await client.pfAdd(itemsViewsKeys(itemId), userId)

    if (!firstView) return

    return Promise.all([
        client.hIncrBy(itemsKey(itemId), 'views', 1),
        client.zIncrBy(itemsByViewsKey(), 1, itemId)
    ])
};
