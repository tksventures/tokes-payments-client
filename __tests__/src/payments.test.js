import axios from 'axios';
import PaymentsAPI from '../../src/payments';

jest.mock('axios');

const sampleHost = 'https://payments.test';
const sampleKey = 'fa4325aa98748b4ff6cXXXXXXXX0f4b9a2bf7a5e3314c28';
const sampleOptions = { headers: { accesskey: sampleKey, appkey: 'unsigned' } };

let payments = PaymentsAPI({ host: sampleHost, apiKey: sampleKey });

describe('Payments', () => {
  beforeEach(() => {
    payments = PaymentsAPI({ host: sampleHost, apiKey: sampleKey });
  });

  describe('Setup', () => {
    it('should error if no host is provided', () => {
      expect(() => {
        PaymentsAPI({ host: undefined });
      }).toThrow();
    });

    it('should make requests according to config', async () => {
      axios.get = jest.fn().mockResolvedValueOnce(true);

      await payments.testKey();

      expect(axios.get).toHaveBeenCalledWith(`${sampleHost}/api/test`, sampleOptions);
    });

    it('should allow for different api key to be declared in method', async () => {
      axios.get = jest.fn().mockResolvedValueOnce(true);
      const altKey = 'fa4325aa98748b4ff6cYYYYYYYY0f4b9a2bf7a5e3314c28';
      const altOptions = { headers: { accesskey: altKey, appkey: 'unsigned' } };

      await payments.testKey(altKey);

      expect(axios.get).toHaveBeenCalledWith(`${sampleHost}/api/test`, altOptions);
    });
  });

  describe('Request Formatting', () => {
    it('should format query params for getStatistics', async () => {
      axios.get = jest.fn().mockResolvedValueOnce(true);

      await payments.getStatistics(sampleKey, { type: 'dollarsPerOrder', currency: 'BTC' });

      expect(axios.get).toHaveBeenCalledWith(`${sampleHost}/api/merchant/stats?type=dollarsPerOrder&currency=BTC&`, sampleOptions);
    });
  });

  describe('Response Handling', () => {
    it('should format address data', async () => {
      payments.withdrawalAddress = jest.fn().mockResolvedValueOnce({
        TKS: '3PGAv1cZXN93UHd4oZy24WQ9j8GGiVs8HJU',
      });

      const result = await payments.getFilteredAddresses();

      expect(result).toMatchObject([
        { currency: 'TKS', address: '3PGAv1cZXN93UHd4oZy24WQ9j8GGiVs8HJU' },
      ]);
    });

    it('should determine if a user has addresses', async () => {
      payments.getFilteredAddresses = jest.fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce([{ currency: 'TKS', address: '3PGAv1cZXN93UHd4oZy24WQ9j8GGiVs8HJU' }]);

      const failed = await payments.hasValidAddress();

      expect(failed).toBeFalsy();

      const success = await payments.hasValidAddress();

      expect(success).toBeTruthy();
    });
  });
});
