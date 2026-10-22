import { Ticket, UrgencyResult, TicketUrgency } from "../models/ticketModel";
import { tickets } from "../../../data/tickets";

const POINTS_PER_DAY: number = 5;

const CRITICAL_THRESHOLD: number = 80;
const HIGH_THRESHOLD: number = 55;
const MODERATE_THRESHOLD: number = 30;

/**
 * Gets the base urgency score for a priority
 * @param priority - The ticket priority
 * @returns The base score (critical 50, high 30, medium 20, low 10)
 */
const getBaseScore = (priority: string): number => {
  if (priority === "critical") {
    return 50;
  }

  if (priority === "high") {
    return 30;
  }

  if (priority === "medium") {
    return 20;
  }

  if (priority === "low") {
    return 10;
  }

  return 0;
};

/**
 * Gets the urgency message for a score
 * @param urgencyScore - The calculated urgency score
 * @returns The urgency level message
 */
const getUrgencyLevel = (urgencyScore: number): string => {
  switch (true) {
    case urgencyScore >= CRITICAL_THRESHOLD:
      return "Critical urgency. Immediate action required.";
    case urgencyScore >= HIGH_THRESHOLD:
      return "High urgency. Prioritize resolution.";
    case urgencyScore >= MODERATE_THRESHOLD:
      return "Moderate. Schedule for attention.";
    default:
      return "Low urgency. Address when capacity allows.";
  }
};

/**
 * Calculates the urgency of a ticket from its priority and age
 * @param ticket - The ticket to calculate urgency for
 * @returns The ticket age in days, the urgency score and the urgency level
 */
export const calculateUrgency = (ticket: Ticket): UrgencyResult => {
  const millisecondsPerDay: number = 24 * 60 * 60 * 1000;
  const ageInMilliseconds: number = Date.now() - ticket.createdAt.getTime();
  const ticketAge: number = Math.floor(ageInMilliseconds / millisecondsPerDay);

  if (ticket.status === "resolved") {
    return {
      ticketAge: ticketAge,
      urgencyScore: 0,
      urgencyLevel: "Minimal . Ticket resolved.",
    };
  }

  const urgencyScore: number =
    getBaseScore(ticket.priority) + ticketAge * POINTS_PER_DAY;
  const urgencyLevel: string = getUrgencyLevel(urgencyScore);

  return {
    ticketAge: ticketAge,
    urgencyScore: urgencyScore,
    urgencyLevel: urgencyLevel,
  };
};

/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  return structuredClone(tickets);
};

/**
 * Retrieves a single ticket by ID
 * @param id - The ID of the ticket to retrieve
 * @returns The matching ticket
 * @throws Error if ticket with given ID is not found
 */
export const getTicketById = async (id: string): Promise<Ticket> => {
  const index: number = tickets.findIndex(
    (ticket: Ticket) => ticket.id.toString() === id
  );

  if (index === -1) {
    throw new Error("Ticket not found");
  }

  return structuredClone(tickets[index]);
};

/**
 * Retrieves a ticket together with its calculated urgency
 * @param id - The ID of the ticket
 * @returns The ticket fields, age, urgency score and urgency level
 * @throws Error if ticket with given ID is not found
 */
export const getTicketUrgency = async (id: string): Promise<TicketUrgency> => {
  const index: number = tickets.findIndex(
    (ticket: Ticket) => ticket.id.toString() === id
  );

  if (index === -1) {
    throw new Error("Ticket not found");
  }

  const ticket: Ticket = tickets[index];
  const urgency: UrgencyResult = calculateUrgency(ticket);

  return {
    id: ticket.id,
    title: ticket.title,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    ticketAge: urgency.ticketAge,
    urgencyScore: urgency.urgencyScore,
    urgencyLevel: urgency.urgencyLevel,
  };
};

/**
 * Creates a new ticket
 * @param ticketData - The data for the new ticket (title, description and priority)
 * @returns The created ticket with generated ID, open status and createdAt
 */
export const createTicket = async (ticketData: {
  title: string;
  description: string;
  priority: string;
}): Promise<Ticket> => {
  const newTicket: Ticket = {
    id: Date.now(),
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority,
    status: "open",
    createdAt: new Date(),
  };

  tickets.push(newTicket);
  return structuredClone(newTicket);
};

/**
 * Updates an existing ticket
 * @param id - The ID of the ticket to update
 * @param ticketData - The fields to update (any of them may be missing)
 * @returns The updated ticket
 * @throws Error if ticket with given ID is not found
 */
export const updateTicket = async (
  id: string,
  ticketData: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
  }
): Promise<Ticket> => {
  const index: number = tickets.findIndex(
    (ticket: Ticket) => ticket.id.toString() === id
  );

  if (index === -1) {
    throw new Error("Ticket not found");
  }

  const existing: Ticket = tickets[index];

  tickets[index] = {
    ...existing,
    title: ticketData.title || existing.title,
    description: ticketData.description || existing.description,
    priority: ticketData.priority || existing.priority,
    status: ticketData.status || existing.status,
  };

  return structuredClone(tickets[index]);
};

/**
 * Deletes a ticket from storage
 * @param id - The ID of the ticket to delete
 * @throws Error if ticket with given ID is not found
 */
export const deleteTicket = async (id: string): Promise<void> => {
  const index: number = tickets.findIndex(
    (ticket: Ticket) => ticket.id.toString() === id
  );

  if (index === -1) {
    throw new Error("Ticket not found");
  }

  tickets.splice(index, 1);
};