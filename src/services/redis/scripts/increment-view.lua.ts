export default `
    local itemsViewsKey = KEYS[1]
    local itemsKey = KEYS[2]
    local itemsByViewsKey = KEYS[3]

    local itemId = ARGV[1]
    local userId = ARGV[2]

    local firstView = redis.call('PFADD', itemsViewsKey, userId)

    if firstView == 0 then
        return
    end

    redis.call('HINCRBY', itemsKey, 'views', 1)
    redis.call('ZINCRBY', itemsByViewsKey, 1, itemId)
`
