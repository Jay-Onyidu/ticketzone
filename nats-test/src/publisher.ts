import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketzone', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'bohoo',
      price: 18,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'bohoo',
  //   price: 18,
  // });
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
