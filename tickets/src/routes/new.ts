import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, ValidateRequest } from '@ojtikzo/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { title, price, imageUrl, description } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      imageUrl,
      description,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      imageUrl: ticket.imageUrl,
      description: ticket.description,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
