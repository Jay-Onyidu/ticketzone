import { Subjects, Publisher, ExpirationCompleteEvent } from '@ojtikzo/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
