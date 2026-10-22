import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as ticketController from "../src/api/v1/controllers/ticketController";
import * as ticketService from "../src/api/v1/services/ticketService";
import type { Ticket, TicketUrgency } from "../src/api/v1/models/ticketModel";

jest.mock("../src/api/v1/services/ticketService");

describe("Ticket Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("getAllTickets", () => {
    it("should handle successful operation", async () => {
      const mockTickets: Ticket[] = [
        {
          id: 1,
          title: "Test Ticket",
          description: "Test Description",
          priority: "low",
          status: "open",
          createdAt: new Date(),
        },
      ];
      (ticketService.getAllTickets as jest.Mock).mockReturnValue(mockTickets);

      await ticketController.getAllTickets(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Tickets retrieved",
        count: 1,
        data: mockTickets,
      });
    });
  });

  describe("getTicketById", () => {
    it("should handle successful operation", async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: "Test Ticket",
        description: "Test Description",
        priority: "low",
        status: "open",
        createdAt: new Date(),
      };
      mockReq.params = { id: "1" };
      (ticketService.getTicketById as jest.Mock).mockReturnValue(mockTicket);

      await ticketController.getTicketById(
        mockReq as Request,
        mockRes as Response
      );

      expect(ticketService.getTicketById).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket retrieved",
        data: mockTicket,
      });
    });
  });

  describe("getTicketUrgency", () => {
    it("should handle successful operation", async () => {
      const mockUrgency: TicketUrgency = {
        id: 1,
        title: "Test Ticket",
        priority: "low",
        status: "open",
        createdAt: new Date(),
        ticketAge: 3,
        urgencyScore: 25,
        urgencyLevel: "Low urgency. Address when capacity allows.",
      };
      mockReq.params = { id: "1" };
      (ticketService.getTicketUrgency as jest.Mock).mockReturnValue(
        mockUrgency
      );

      await ticketController.getTicketUrgency(
        mockReq as Request,
        mockRes as Response
      );

      expect(ticketService.getTicketUrgency).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket urgency calculated",
        data: mockUrgency,
      });
    });
  });

  describe("createTicket", () => {
    it("should handle successful creation", async () => {
      const mockTicket: {
        title: string;
        description: string;
        priority: string;
      } = {
        title: "Test Ticket",
        description: "Test Description",
        priority: "high",
      };
      const createdTicket: Ticket = {
        id: 1,
        ...mockTicket,
        status: "open",
        createdAt: new Date(),
      };

      mockReq.body = mockTicket;
      (ticketService.createTicket as jest.Mock).mockReturnValue(createdTicket);

      await ticketController.createTicket(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket created",
        data: createdTicket,
      });
    });

    it("should return 400 when title is missing", async () => {
      mockReq.body = { description: "Test Description", priority: "low" };

      await ticketController.createTicket(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Missing required field: title",
      });
    });
  });

  describe("updateTicket", () => {
    it("should handle successful update", async () => {
      const updatedTicket: Ticket = {
        id: 1,
        title: "Test Ticket",
        description: "Test Description",
        priority: "low",
        status: "resolved",
        createdAt: new Date(),
      };
      mockReq.params = { id: "1" };
      mockReq.body = { status: "resolved" };
      (ticketService.updateTicket as jest.Mock).mockReturnValue(updatedTicket);

      await ticketController.updateTicket(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket updated",
        data: updatedTicket,
      });
    });

    it("should return 400 when priority is invalid", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { priority: "urgent" };

      await ticketController.updateTicket(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
    });
  });

  describe("deleteTicket", () => {
    it("should handle successful deletion", async () => {
      mockReq.params = { id: "1" };

      await ticketController.deleteTicket(
        mockReq as Request,
        mockRes as Response
      );

      expect(ticketService.deleteTicket).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket deleted",
      });
    });
  });
});