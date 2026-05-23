jest.mock('axios');

describe('api service', () => {
  let fetchVehicles, fetchVehicleById, fetchVehiclesByStatus, fetchStatistics;
  let mockGet;

  beforeEach(() => {
    mockGet = jest.fn();

    // isolateModules ensures api.js is freshly required after axios.create is set up
    jest.isolateModules(() => {
      const axios = require('axios');
      axios.create.mockReturnValue({ get: mockGet });

      const api = require('./api');
      fetchVehicles = api.fetchVehicles;
      fetchVehicleById = api.fetchVehicleById;
      fetchVehiclesByStatus = api.fetchVehiclesByStatus;
      fetchStatistics = api.fetchStatistics;
    });
  });

  describe('fetchVehicles', () => {
    it('calls /api/vehicles and returns response data', async () => {
      const payload = { success: true, data: [{ id: '1', vehicleNumber: 'TRK-001' }] };
      mockGet.mockResolvedValue({ data: payload });

      const result = await fetchVehicles();

      expect(mockGet).toHaveBeenCalledWith('/api/vehicles');
      expect(result).toEqual(payload);
    });

    it('propagates errors from the API', async () => {
      mockGet.mockRejectedValue(new Error('Network Error'));
      await expect(fetchVehicles()).rejects.toThrow('Network Error');
    });
  });

  describe('fetchVehicleById', () => {
    it('calls /api/vehicles/:id with the correct id', async () => {
      const payload = { success: true, data: { id: '42', vehicleNumber: 'TRK-042' } };
      mockGet.mockResolvedValue({ data: payload });

      const result = await fetchVehicleById('42');

      expect(mockGet).toHaveBeenCalledWith('/api/vehicles/42');
      expect(result).toEqual(payload);
    });

    it('propagates errors from the API', async () => {
      mockGet.mockRejectedValue(new Error('Not Found'));
      await expect(fetchVehicleById('999')).rejects.toThrow('Not Found');
    });
  });

  describe('fetchVehiclesByStatus', () => {
    it('calls /api/vehicles/status/:status with the correct status', async () => {
      const payload = { success: true, data: [] };
      mockGet.mockResolvedValue({ data: payload });

      const result = await fetchVehiclesByStatus('en_route');

      expect(mockGet).toHaveBeenCalledWith('/api/vehicles/status/en_route');
      expect(result).toEqual(payload);
    });

    it('works for idle, delivered, and en_route', async () => {
      mockGet.mockResolvedValue({ data: { success: true, data: [] } });

      for (const status of ['idle', 'delivered', 'en_route']) {
        await fetchVehiclesByStatus(status);
        expect(mockGet).toHaveBeenCalledWith(`/api/vehicles/status/${status}`);
      }
    });
  });

  describe('fetchStatistics', () => {
    it('calls /api/statistics and returns response data', async () => {
      const payload = { success: true, data: { total: 10, en_route: 4 } };
      mockGet.mockResolvedValue({ data: payload });

      const result = await fetchStatistics();

      expect(mockGet).toHaveBeenCalledWith('/api/statistics');
      expect(result).toEqual(payload);
    });

    it('propagates errors from the API', async () => {
      mockGet.mockRejectedValue(new Error('Server Error'));
      await expect(fetchStatistics()).rejects.toThrow('Server Error');
    });
  });
});
