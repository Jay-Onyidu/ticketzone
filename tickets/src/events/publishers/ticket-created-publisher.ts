import { Publisher, Subjects, TicketCreatedEvent } from '@ojtikzo/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
