/**
 * Represents a support ticket in the system
 */
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: Date;
}

/**
 * The result of the urgency calculation for a ticket
 */
export interface UrgencyResult {
  ticketAge: number;
  urgencyScore: number;
  urgencyLevel: string;
}

/**
 * A ticket together with its urgency, as the urgency endpoint returns it
 */
export interface TicketUrgency {
  id: number;
  title: string;
  priority: string;
  status: string;
  createdAt: Date;
  ticketAge: number;
  urgencyScore: number;
  urgencyLevel: string;
}