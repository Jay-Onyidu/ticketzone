import { Publisher, OrderCreatedEvent, Subjects } from '@ojtikzo/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
