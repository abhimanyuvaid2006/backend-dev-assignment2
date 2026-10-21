import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService";
import type { Ticket } from "../models/ticketModel";

/**
 * Checks if a priority is one of the allowed values
 * @param priority - The priority to check
 * @returns true if the priority is allowed, false if not
 */
const isValidPriority = (priority: string): boolean => {
  if (
    priority === "critical" ||
    priority === "high" ||
    priority === "medium" ||
    priority === "low"
  ) {
    return true;
  }

  return false;
};

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
    const id: string = req.params.id as string;
    const ticket: Ticket = await ticketService.getTicketById(id);
    res.status(HTTP_STATUS.OK).json({
      message: "Ticket retrieved",
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: "Ticket not found",
    });
  }
};

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Basic validation - check for required fields
    if (!req.body.title) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Missing required field: title",
      });
    } else if (!req.body.description) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Missing required field: description",
      });
    } else if (!isValidPriority(req.body.priority)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
    } else {
      // Extract only the fields we need
      const { title, description, priority } = req.body;

      const ticketData: {
        title: string;
        description: string;
        priority: string;
      } = { title, description, priority };

      const newTicket: Ticket = await ticketService.createTicket(ticketData);
      res.status(HTTP_STATUS.CREATED).json({
        message: "Ticket created",
        data: newTicket,
      });
    }
  } catch (error) {
    next(error);
  }
};