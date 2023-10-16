import { client } from '$services/redis';
import { userKey, usernamesListKey } from '$services/keys';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(userKey(id));

    return {
        id: user.id,
        ...user,
    };
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId();

    const exist = await client.sIsMember(usernamesListKey(), attrs.username);
    
    if (exist) {
        throw new Error('Username already exists');
    }

    await client.hSet(userKey(id), {
        username: attrs.username,
        password: attrs.password,
    })

    await client.sAdd(usernamesListKey(), attrs.username);

    return id;
};
