const maintenanceController = require("../../../controllers/maintenanceController");
const maintenanceModel = require("../../../models/maintenanceModel");

jest.mock("../../../models/maintenanceModel");

const mockReq = {};
const mockRes = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

describe("Maintenance Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMaintenanceRequests", () => {
    it("should return all maintenance requests", async () => {
      const mockRequests = [
        { id: 1, description: "Fix AC" },
        { id: 2, description: "Fix heater" },
      ];

      maintenanceModel.getAllMaintenanceRequests.mockResolvedValue(
        mockRequests
      );

      await maintenanceController.getAllMaintenanceRequests(mockReq, mockRes);

      expect(maintenanceModel.getAllMaintenanceRequests).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockRequests);
    });

    it("should return 500 on error", async () => {
      const errorMessage = "Error retrieving requests";

      maintenanceModel.getAllMaintenanceRequests.mockRejectedValue(
        new Error(errorMessage)
      );

      await maintenanceController.getAllMaintenanceRequests(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error retrieving maintenance requests",
        error: errorMessage,
      });
    });
  });
});

describe("getMaintenanceRequestById", () => {
  it("should return a specific maintenance request by ID", async () => {
    const mockRequest = { id: 1, description: "Fix AC" };
    const mockReq = { params: { id: 1 } };

    maintenanceModel.getMaintenanceRequestById.mockResolvedValue(mockRequest);

    await maintenanceController.getMaintenanceRequestById(mockReq, mockRes);

    expect(maintenanceModel.getMaintenanceRequestById).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith(mockRequest);
  });

  it("should return 404 if no maintenance request found", async () => {
    const mockReq = { params: { id: 1 } };

    maintenanceModel.getMaintenanceRequestById.mockResolvedValue(null);

    await maintenanceController.getMaintenanceRequestById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Maintenance request not found",
    });
  });

  it("should return 500 on error", async () => {
    const mockReq = { params: { id: 1 } };
    const errorMessage = "Error retrieving request";

    maintenanceModel.getMaintenanceRequestById.mockRejectedValue(
      new Error(errorMessage)
    );

    await maintenanceController.getMaintenanceRequestById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error retrieving maintenance request",
      error: errorMessage,
    });
  });
});

describe("createMaintenanceRequest", () => {
  it("should create a new maintenance request", async () => {
    const mockRequest = { id: 1, description: "Fix AC" };
    const mockReq = { body: { description: "Fix AC" } };

    maintenanceModel.createMaintenanceRequest.mockResolvedValue(mockRequest);

    await maintenanceController.createMaintenanceRequest(mockReq, mockRes);

    expect(maintenanceModel.createMaintenanceRequest).toHaveBeenCalledWith(
      mockReq.body
    );
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockRequest);
  });

  it("should return 500 on error", async () => {
    const mockReq = { body: { description: "Fix AC" } };
    const errorMessage = "Error creating request";

    maintenanceModel.createMaintenanceRequest.mockRejectedValue(
      new Error(errorMessage)
    );

    await maintenanceController.createMaintenanceRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error creating maintenance request",
      error: errorMessage,
    });
  });
});

describe("updateMaintenanceRequest", () => {
  it("should update an existing maintenance request", async () => {
    const mockRequest = { id: 1, description: "Fix AC" };
    const mockReq = { params: { id: 1 }, body: { description: "Fix AC" } };

    maintenanceModel.updateMaintenanceRequest.mockResolvedValue(mockRequest);

    await maintenanceController.updateMaintenanceRequest(mockReq, mockRes);

    expect(maintenanceModel.updateMaintenanceRequest).toHaveBeenCalledWith(
      1,
      mockReq.body
    );
    expect(mockRes.json).toHaveBeenCalledWith(mockRequest);
  });

  it("should return 404 if request not found", async () => {
    const mockReq = { params: { id: 1 }, body: { description: "Fix AC" } };

    maintenanceModel.updateMaintenanceRequest.mockResolvedValue(null);

    await maintenanceController.updateMaintenanceRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Maintenance request not found",
    });
  });

  it("should return 500 on error", async () => {
    const mockReq = { params: { id: 1 }, body: { description: "Fix AC" } };
    const errorMessage = "Error updating request";

    maintenanceModel.updateMaintenanceRequest.mockRejectedValue(
      new Error(errorMessage)
    );

    await maintenanceController.updateMaintenanceRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error updating maintenance request",
      error: errorMessage,
    });
  });
});

describe("deleteMaintenanceRequest", () => {
  it("should delete a maintenance request", async () => {
    const mockReq = { params: { id: 1 } };

    maintenanceModel.deleteMaintenanceRequest.mockResolvedValue();

    await maintenanceController.deleteMaintenanceRequest(mockReq, mockRes);

    expect(maintenanceModel.deleteMaintenanceRequest).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Maintenance request deleted successfully",
    });
  });

  it("should return 500 on error", async () => {
    const mockReq = { params: { id: 1 } };
    const errorMessage = "Error deleting request";

    maintenanceModel.deleteMaintenanceRequest.mockRejectedValue(
      new Error(errorMessage)
    );

    await maintenanceController.deleteMaintenanceRequest(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error deleting maintenance request",
      error: errorMessage,
    });
  });
});
