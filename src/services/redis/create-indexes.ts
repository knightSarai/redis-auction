import { SchemaFieldTypes } from 'redis';
import { client } from './client';
import { itemsIndexKey, itemsKey } from '$services/keys';


export const createIndexes = async () => {
    const index = await client.ft._list();

    if (index.includes(itemsIndexKey())) {
        return;
    }
    return client.ft.create(
        itemsIndexKey(),
        {
            name: {
                type: SchemaFieldTypes.TEXT,
                WEIGHT: 5, 
                sortable: true
            },
            description: {
                type: SchemaFieldTypes.TEXT,
                sortable: false
            },
            ownerId: {
                type: SchemaFieldTypes.TAG,
                sortable: true
            },
            endingAt: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            bids: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            views: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            price: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            likes: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
        }as any,
        {
            ON: 'HASH',
            PREFIX: itemsKey(''),
        }
    )
};
