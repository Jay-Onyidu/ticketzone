import { Subjects, Publisher, OrderCancelledEvent } from '@ojtikzo/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
