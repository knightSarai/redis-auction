import { createClient } from 'redis';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
