import { client } from '$services/redis';
import { userKey, usernamesKey, usernamesUniqueKey } from '$services/keys';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {
    let userId: number | string = await client.zScore(usernamesKey(), username);

    if (!userId) {
        throw new Error('User not found');
    };

    return getUserById((userId).toString(16));

};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(userKey(id));


    return {
        id,
        ...user,
    };
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId();

    const exist = await client.sIsMember(usernamesUniqueKey(), attrs.username);
    
    if (exist) {
        throw new Error('Username already exists');
    }

    await client.hSet(userKey(id), {
        username: attrs.username,
        password: attrs.password,
    })

    await client.sAdd(usernamesUniqueKey(), attrs.username);
    await client.zAdd(usernamesKey(), {
        value: attrs.username,
        score: parseInt(id, 16)
    })

    return id;
};
