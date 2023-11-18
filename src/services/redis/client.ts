import { createClient, defineScript } from 'redis';
import { createIndexes } from './create-indexes';
import { itemsKey, itemsByViewsKey, itemsViewsKeys } from '$services/keys';
import incrementViewScript from './scripts/increment-view.lua';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
    scripts: {
        incrementView: defineScript({
            NUMBER_OF_KEYS: 3,
            SCRIPT: incrementViewScript,
            transformArguments(itemId: string, userId: string) {
                return [
                    itemsViewsKeys(itemId),
                    itemsKey(itemId),
                    itemsByViewsKey(),
                    itemId,
                    userId
                ]
            },
        })


    }
});

client.on('error', (err) => console.error(err));

client.connect();

client.on('connect', async () => {
    try {
        await createIndexes();
    } catch (error) {
        console.error(error);
    }
});

export { client };
