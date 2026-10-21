import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService";
import type { Ticket } from "../models/ticketModel";

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tickets: Ticket[] = await ticketService.getAllTickets();
    res.status(HTTP_STATUS.OK).json({
      message: "Tickets retrieved",
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: number = Number(req.params.id);
    const ticket: Ticket = await ticketService.getTicketById(id);
    res.status(HTTP_STATUS.OK).json({
      message: "Ticket retrieved",
      data: ticket,
    });
  } catch {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: "Ticket not found",
    });
  }
};