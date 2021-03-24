import { Publisher, Subjects, TicketUpdatedEvent } from '@ojtikzo/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
