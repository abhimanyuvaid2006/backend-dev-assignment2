import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as ticketController from "../src/api/v1/controllers/ticketController";
import * as ticketService from "../src/api/v1/services/ticketService";
import type { Ticket } from "../src/api/v1/models/ticketModel";

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
      // Arrange
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

      // Act
      await ticketController.getAllTickets(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      // Assert
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
      // Arrange
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

      // Act
      await ticketController.getTicketById(
        mockReq as Request,
        mockRes as Response
      );

      // Assert
      expect(ticketService.getTicketById).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket retrieved",
        data: mockTicket,
      });
    });
  });

  describe("createTicket", () => {
    it("should handle successful creation", async () => {
      // Arrange
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

      // Act
      await ticketController.createTicket(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket created",
        data: createdTicket,
      });
    });

    it("should return 400 when title is missing", async () => {
      // Arrange
      mockReq.body = { description: "Test Description", priority: "low" };

      // Act
      await ticketController.createTicket(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Missing required field: title",
      });
    });
  });

  describe("updateTicket", () => {
    it("should handle successful update", async () => {
      // Arrange
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

      // Act
      await ticketController.updateTicket(
        mockReq as Request,
        mockRes as Response
      );

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket updated",
        data: updatedTicket,
      });
    });

    it("should return 400 when priority is invalid", async () => {
      // Arrange
      mockReq.params = { id: "1" };
      mockReq.body = { priority: "urgent" };

      // Act
      await ticketController.updateTicket(
        mockReq as Request,
        mockRes as Response
      );

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
    });
  });

  describe("deleteTicket", () => {
    it("should handle successful deletion", async () => {
      // Arrange
      mockReq.params = { id: "1" };

      // Act
      await ticketController.deleteTicket(
        mockReq as Request,
        mockRes as Response
      );

      // Assert
      expect(ticketService.deleteTicket).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Ticket deleted",
      });
    });
  });
});