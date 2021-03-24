import { Publisher, Subjects, TicketCreatedEvent } from '@ojtikzo/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
