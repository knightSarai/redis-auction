import { client } from '$services/redis';
import { bidHistoryKey } from '$services/keys';
import { DateTime } from 'luxon';
import type { CreateBidAttrs, Bid } from '$services/types';

export const createBid = async (attrs: CreateBidAttrs) => {
    return await client.rPush(
        bidHistoryKey(attrs.itemId),
        serializeHistory(
            attrs.amount,
            attrs.createdAt.toMillis()
        )
    );

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
