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