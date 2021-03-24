import { Publisher, OrderCancelledEvent, Subjects } from '@ojtikzo/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
