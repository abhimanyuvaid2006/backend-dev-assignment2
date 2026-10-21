import { Ticket } from "../models/ticketModel";
import { tickets } from "../../../data/tickets";

/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  // Return a deep clone to avoid direct mutation
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
 * Creates a new ticket
 * @param ticketData - The data for the new ticket (title, description and priority)
 * @returns The created ticket with generated ID, open status and createdAt
 */
export const createTicket = async (ticketData: {
  title: string;
  description: string;
  priority: string;
}): Promise<Ticket> => {
  // Create a new ticket with auto-generated ID
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

  // Only overwrite the fields that were actually provided
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