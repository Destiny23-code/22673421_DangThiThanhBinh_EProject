require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://mongodb:27017/orders',
    rabbitMQURI: 'amqp://rabbitmq',
    rabbitMQQueue: 'orders',
    port: 3002
};
  