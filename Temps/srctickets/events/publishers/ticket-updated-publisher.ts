import { Publisher, Subjects, TicketUpdatedEvent } from '@ojtikzo/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
