import { calculateUrgency } from "../src/api/v1/services/ticketService";
import type { Ticket, UrgencyResult } from "../src/api/v1/models/ticketModel";

const makeTicket = (
  priority: string,
  status: string,
  daysOld: number
): Ticket => {
  const millisecondsPerDay: number = 24 * 60 * 60 * 1000;

  return {
    id: 1,
    title: "Test Ticket",
    description: "Test Description",
    priority: priority,
    status: status,
    createdAt: new Date(Date.now() - daysOld * millisecondsPerDay),
  };
};

describe("calculateUrgency", () => {
  it("should return a score of 25 and the low urgency message for a low ticket that is 3 days old", () => {
    const ticket: Ticket = makeTicket("low", "open", 3);

    const result: UrgencyResult = calculateUrgency(ticket);

    expect(result.urgencyScore).toBe(25);
    expect(result.urgencyLevel).toBe(
      "Low urgency. Address when capacity allows."
    );
  });

  it("should return a score of 55 and an age of 5 days for a high ticket that is 5 days old", () => {
    const ticket: Ticket = makeTicket("high", "open", 5);

    const result: UrgencyResult = calculateUrgency(ticket);

    expect(result.ticketAge).toBe(5);
    expect(result.urgencyScore).toBe(55);
  });

  it("should return a score of 80 for a critical ticket that is 6 days old", () => {
    const ticket: Ticket = makeTicket("critical", "open", 6);

    const result: UrgencyResult = calculateUrgency(ticket);

    expect(result.urgencyScore).toBe(80);
  });

  it("should return a score of 0 for a resolved ticket", () => {
    const ticket: Ticket = makeTicket("medium", "resolved", 10);

    const result: UrgencyResult = calculateUrgency(ticket);

    expect(result.urgencyScore).toBe(0);
  });
});