const redis = require('redis');
const WebSocket = require('ws');
const { getLocations } = require('./utils');

// Redis subscriber client
const client = redis.createClient({ url: "redis://127.0.0.1:6379/0" });
const subscriber = client.duplicate();

// Store locations globally
let locations = [];

subscriber.on('error', (err) => {
  console.error('Redis error:', err);
});

// Message handler function
const handleMessage = (message, channel) => {
  console.log(`Received message from ${channel}: ${message}`);

  // Extract location from the channel name
  const location = channel.replace('traffic_channel_', '');
  broadcastSignal(location, message);
};

const subscribeToLocation = async (location) => {
  const channel = `traffic_channel_${location}`;
  try {
    await subscriber.subscribe(channel, handleMessage);
    console.log(`Subscribed to channel: ${channel}`);
  } catch (error) {
    console.error(`Error subscribing to ${channel}:`, error);
  }
};

// Initialize Redis connection and subscriptions
async function initialize() {
  try {
    // Connect to Redis
    await subscriber.connect();
    
    // Get and subscribe to locations
    const locationResponse = await getLocations();
    locations = locationResponse.map(location => location.name);
    
    // Subscribe to each location
    for (const location of locations) {
      await subscribeToLocation(location);
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast signal to clients based on location
const broadcastSignal = (location, signal) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.location === location) {
      console.log(`Sending signal to client for location: ${location}`);
      client.send(JSON.stringify({ location, signal }));
    }
  });
};


wss.on('connection', (ws, req) => {
  const params = new URLSearchParams(req.url.replace('/', ''));
  const location = params.get('location');
  // Store the location on the WebSocket connection
  ws.location = location;
  console.log(`Client connected for location: ${location}`);
});


initialize().then(() => {
  console.log('WebSocket server running on ws://localhost:8080');
}).catch(error => {
  console.error('Failed to start server:', error);
});