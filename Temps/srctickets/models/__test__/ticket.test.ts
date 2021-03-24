import { Ticket } from '../ticket';

it('it iplements optimistic concurrency control', async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: 'Running man',
    price: 25,
    userId: '123',
  });
  //save the ticket to the database
  await ticket.save();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make seperate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //save the first fetched tickets
  await firstInstance!.save();

  //save the second fetched ticket and expect an error
  await secondInstance!.save();
  // try {
  // } catch (err) {
  //   return done();
  // }

  // throw new Error('we should not reach this point');
});

it('increments to version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'bohoo bohoo',
    price: 23,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
