import { itemsIndexKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from './deserialize';

export const searchItems = async (term: string, size: number = 5) => {
    const cleanedTerm = (
        term
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .toLowerCase()
        .split(' ')
        .map((word) => word ? `*${word}*` : '')
        .join(' ')
    )

    if (!cleanedTerm) {
        return [];
    }

    const results = await client.ft.search(
        itemsIndexKey(),
        cleanedTerm,
        {
            LIMIT: {
                from: 0,
                size
            }
        }
    )

    return (
        results
        .documents
        .map(({id, value}) => deserialize(id, value as any))
    )


};
