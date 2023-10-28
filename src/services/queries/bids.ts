import { client } from '$services/redis';
import { bidHistoryKey, itemsKey, itemsPriceKey } from '$services/keys';
import { getItem } from '$services/queries/items';
import { DateTime } from 'luxon';
import type { CreateBidAttrs, Bid } from '$services/types';

export const createBid = async (attrs: CreateBidAttrs) => {
    return client.executeIsolated(async (isolatedClient) => {
        await isolatedClient.watch(itemsKey(attrs.itemId));

        const item = await getItem(attrs.itemId);

        if (!item) {
            throw new Error('Item not found');
        }

        if (item.endingAt.diffNow().toMillis() < 0) {
            throw new Error('Item closed for bidding');
        }

        if (attrs.amount <= item.price) {
            throw new Error('Bid amount must be greater than current price');
        }


        const history = serializeHistory(attrs.amount, attrs.createdAt.toMillis())

        return isolatedClient
            .multi()
            .rPush(bidHistoryKey(attrs.itemId), history)
            .hSet(itemsKey(item.id), {
                price: attrs.amount,
                bids: item.bids + 1,
                highestBidUserId: attrs.userId,
            })
            .zAdd(itemsPriceKey(), {
                value: item.id,
                score: attrs.amount,
            })
            .exec();
    })
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
    const startIdx = -1 * offset - count;
    const endIdx = -1 - offset;
    const history = await client.lRange(bidHistoryKey(itemId), startIdx, endIdx);
    return history.map(deserializeHistory);
};


const serializeHistory = (amount: number, createdAt: number) => amount + ':' + createdAt;

const deserializeHistory = (storedValue: string) => {
    const [amount, createdAt] = storedValue.split(':');
    return {
        amount: parseFloat(amount),
        createdAt: DateTime.fromMillis(parseInt(createdAt)),
    };

}
