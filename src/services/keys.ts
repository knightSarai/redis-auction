export const pageCacheKey = (id: string) => 'pagecache#' + id;
export const userKey = (id: string) => 'user#' + id;
export const sessionKey = (id: string) => 'session#' + id;
export const usernamesUniqueKey = () => 'usernames:unique'
export const usernamesKey = () => 'usernames'
export const usersLikesKey = (userId: string) => 'users:likes#' + userId;

export const itemsKey = (id: string) => 'items#' + id;
export const itemsByViewsKey = () => 'items:views';
export const itemsByEndingAtKey = () => 'items:endingAt';
export const itemsViewsKeys = (id: string) => 'items:views#' + id;
export const itemsPriceKey = () => 'items:price';
export const bidHistoryKey = (id: string) => 'bidHistory#' + id;
export const itemsIndexKey = () => 'idx:items';
