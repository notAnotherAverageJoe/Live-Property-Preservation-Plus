const financialController = require("../../../controllers/financialController");
const financialModel = require("../../../models/financialModel");

// Mock the financialModel methods
jest.mock("../../../models/financialModel");

const mockReq = {};
const mockRes = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

describe("Financial Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllFinancialTransactions", () => {
    it("should return all financial transactions", async () => {
      const mockTransactions = [
        { id: 1, amount: 100, description: "Deposit" },
        { id: 2, amount: -50, description: "Withdrawal" },
      ];

      financialModel.getAllFinancialTransactions.mockResolvedValue(
        mockTransactions
      );

      await financialController.getAllFinancialTransactions(mockReq, mockRes);

      expect(financialModel.getAllFinancialTransactions).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockTransactions);
    });

    it("should return 500 on error", async () => {
      const errorMessage = "Error retrieving transactions";

      financialModel.getAllFinancialTransactions.mockRejectedValue(
        new Error(errorMessage)
      );

      await financialController.getAllFinancialTransactions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error retrieving financial transactions",
        error: errorMessage,
      });
    });
  });

  describe("getFinancialTransactionById", () => {
    it("should return a financial transaction by ID", async () => {
      const mockTransaction = { id: 1, amount: 100, description: "Deposit" };
      const mockReq = { params: { id: 1 } };

      financialModel.getFinancialTransactionById.mockResolvedValue(
        mockTransaction
      );

      await financialController.getFinancialTransactionById(mockReq, mockRes);

      expect(financialModel.getFinancialTransactionById).toHaveBeenCalledWith(
        1
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockTransaction);
    });

    it("should return 404 if no transaction found", async () => {
      const mockReq = { params: { id: 1 } };

      financialModel.getFinancialTransactionById.mockResolvedValue(null);

      await financialController.getFinancialTransactionById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Financial transaction not found",
      });
    });

    it("should return 500 on error", async () => {
      const mockReq = { params: { id: 1 } };
      const errorMessage = "Error fetching transaction";

      financialModel.getFinancialTransactionById.mockRejectedValue(
        new Error(errorMessage)
      );

      await financialController.getFinancialTransactionById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching financial transaction",
        error: errorMessage,
      });
    });
  });

  describe("createFinancialTransaction", () => {
    it("should create a new financial transaction", async () => {
      const mockTransaction = { id: 1, amount: 100, description: "Deposit" };
      const mockReq = { body: { amount: 100, description: "Deposit" } };

      financialModel.createFinancialTransaction.mockResolvedValue(
        mockTransaction
      );

      await financialController.createFinancialTransaction(mockReq, mockRes);

      expect(financialModel.createFinancialTransaction).toHaveBeenCalledWith(
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockTransaction);
    });

    it("should return 500 on error", async () => {
      const mockReq = { body: { amount: 100, description: "Deposit" } };
      const errorMessage = "Error creating transaction";

      financialModel.createFinancialTransaction.mockRejectedValue(
        new Error(errorMessage)
      );

      await financialController.createFinancialTransaction(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error creating financial transaction",
        error: errorMessage,
      });
    });
  });

  describe("updateFinancialTransaction", () => {
    it("should update an existing financial transaction", async () => {
      const mockTransaction = { id: 1, amount: 100, description: "Deposit" };
      const mockReq = {
        params: { id: 1 },
        body: { amount: 100, description: "Deposit" },
      };

      financialModel.updateFinancialTransaction.mockResolvedValue(
        mockTransaction
      );

      await financialController.updateFinancialTransaction(mockReq, mockRes);

      expect(financialModel.updateFinancialTransaction).toHaveBeenCalledWith(
        1,
        mockReq.body
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockTransaction);
    });

    it("should return 404 if transaction not found", async () => {
      const mockReq = {
        params: { id: 1 },
        body: { amount: 100, description: "Deposit" },
      };

      financialModel.updateFinancialTransaction.mockResolvedValue(null);

      await financialController.updateFinancialTransaction(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Financial transaction not found",
      });
    });

    it("should return 500 on error", async () => {
      const mockReq = {
        params: { id: 1 },
        body: { amount: 100, description: "Deposit" },
      };
      const errorMessage = "Error updating transaction";

      financialModel.updateFinancialTransaction.mockRejectedValue(
        new Error(errorMessage)
      );

      await financialController.updateFinancialTransaction(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error updating financial transaction",
        error: errorMessage,
      });
    });
  });

  describe("deleteFinancialTransaction", () => {
    it("should delete a financial transaction", async () => {
      const mockReq = { params: { id: 1 } };

      financialModel.deleteFinancialTransaction.mockResolvedValue();

      await financialController.deleteFinancialTransaction(mockReq, mockRes);

      expect(financialModel.deleteFinancialTransaction).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Financial transaction deleted successfully",
      });
    });

    it("should return 500 on error", async () => {
      const mockReq = { params: { id: 1 } };
      const errorMessage = "Error deleting transaction";

      financialModel.deleteFinancialTransaction.mockRejectedValue(
        new Error(errorMessage)
      );

      await financialController.deleteFinancialTransaction(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error deleting financial transaction",
        error: errorMessage,
      });
    });
  });
});
