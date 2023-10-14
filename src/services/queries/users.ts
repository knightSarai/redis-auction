import { client } from '$services/redis';
import { userKey } from '$services/keys';
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

    await client.hSet(userKey(id), {
        username: attrs.username,
        password: attrs.password,
    })

    return id;
};
