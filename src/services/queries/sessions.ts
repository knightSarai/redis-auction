import { client } from '$services/redis';
import { sessionKey } from '$services/keys';
import type { Session } from '$services/types';


export const getSession = async (id: string) => {
    const session = await client.hGetAll(sessionKey(id));

    if (!Object.keys(session).length) {
        return null;
    }

    return {
        id,
        ...session,
    };
};

export const saveSession = async (session: Session) => {
   return await client.hSet(sessionKey(session.id), {
        userId: session.userId,
        username: session.username,
    });
};
