const axios = require('axios');

function Payments(config) {
  const { host, apiKey, serviceKey } = config;

  if (!host) throw new Error('Payments host definition is required');
  if (!apiKey) throw new Error('The API key is required');

  async function get(path, accesskey = apiKey) {
    const { data } = await axios.get(`${host}${path}`, {
      headers: { accesskey, appkey: serviceKey || 'unsigned' },
    });
    return data;
  }

  async function post(path, postData, accesskey = apiKey) {
    const { data } = await axios.post(`${host}${path}`, postData, {
      headers: { accesskey, appkey: serviceKey || 'unsigned' },
    });
    return data;
  }

  async function put(path, putData, accesskey = apiKey) {
    const { data } = await axios.put(`${host}${path}`, putData, {
      headers: { accesskey, appkey: serviceKey || 'unsigned' },
    });
    return data;
  }

  async function patch(path, patchData, accesskey = apiKey) {
    try {
      const { data } = await axios.patch(`${host}${path}`, patchData, {
        headers: { accesskey, appkey: serviceKey || 'unsigned' },
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async function del(path, accesskey = apiKey) {
    const { data } = await axios.delete(`${host}${path}`, {
      headers: { accesskey, appkey: serviceKey || 'unsigned' },
    });
    return data;
  }

  async function delNoData(path, accesskey = apiKey) {
    const response = await axios.delete(`${host}${path}`, {
      headers: { accesskey, appkey: serviceKey || 'unsigned' },
    });
    return response;
  }

  const PaymentsAPI = {
    test: () => get('/'),

    testKey: accesskey => get('/api/test', accesskey),

    createMerchant: userData => post('/api/merchant', userData),

    renewKey: accesskey => post('/api/merchant/key', {}, accesskey),

    stageOrder: (orderData, accesskey) => post('/api/merchant/orders', orderData, accesskey),

    updateOrder: (orderData, accesskey) => put(`/api/merchant/orders/${orderData.id}`, orderData, accesskey),

    tokesPayment: (data, accesskey) => post('/api/merchant/payments', data, accesskey),

    payment: (data, accesskey) => post(`/api/merchant/payments/${data.currency}`, data, accesskey),

    orderStatus: (id, accesskey) => get(`/api/merchant/orders/${id}`, accesskey),

    orderReference: (referenceId, accesskey) => get(`/api/merchant/refs/${referenceId}`, accesskey),

    paymentStatus: (id, accesskey) => get(`/api/merchant/payments/${id}`, accesskey),

    paymentReceipt: (id, accesskey) => get(`/api/merchant/receipt/${id}`, accesskey),

    marketUSDRate: (currency, accesskey) => get(`/api/markets/${currency}/rate`, accesskey),

    rateOrder: (data, accesskey) => put(`/api/merchant/rate/${data.id}`, data, accesskey),

    tokesWithdrawalAddress: accesskey => get('/api/merchant/address', accesskey),

    withdrawalAddress: (currency, accesskey) => get(`/api/merchant/address/${currency || ''}`, accesskey),

    updateWithdrawalAddress: (data, currency, accesskey) => put(`/api/merchant/address/${currency || ''}`, data, accesskey),

    deleteWithdrawalAddress: (currency, accesskey) => del(`/api/merchant/address/${currency}`, accesskey),

    orderHistory: (page, sort, accesskey) => get(`/api/merchant/orders?page=${page}&sort=${sort}`, accesskey),

    salesRecords: (days, accesskey) => get(`/api/merchant/records?days=${days}`, accesskey),

    accountData: accesskey => get('/api/account', accesskey),

    accountLookup: (table, id, accesskey) => get(`/api/account/${table}/${id}`, accesskey),

    accountUpdate: (table, id, data, accesskey) => put(`/api/account/${table}/${id}`, data, accesskey),

    updateWebhooks: (webhook_url, accesskey) => put('/api/merchant/webhooks', { webhook_url }, accesskey),

    accountCreate: (table, data, accesskey) => post(`/api/account/${table}`, data, accesskey),

    connectShopify: (shop, accessKey) => get(`/api/shopify/${shop}`, accessKey),

    saveShopifyToken: (data, accessKey) => post('/api/shopify/token', data, accessKey),

    toggleAllocations: async accesskey => put('/api/merchant/allocations', {}, accesskey),

    updateAllocation: async (accesskey, allocation) => post('/api/merchant/allocations', {
      currency: allocation.currency,
      percentage: allocation.percentage,
    }, accesskey),

    deleteAllocation: async (accesskey, id) => del(`/api/merchant/allocations/${id}`, accesskey),

    questionnaireData: accesskey => get('/api/questionnaires', accesskey),

    kycStatus: async accesskey => get('/api/kyc/status', accesskey),

    contacts: async accesskey => get('/api/kyc/contacts', accesskey),

    updateContacts: async accesskey => put('/api/kyc/contacts', {}, accesskey),

    createAccount: async (contactData, accesskey) => post('/api/kyc/accounts', contactData, accesskey),

    kycContactsGet: accesskey => get('/api/kyc/contacts', accesskey),

    kycContactsGetAll: accesskey => get('/api/kyc/contacts/related', accesskey),

    kycContactsGetOne: (id, accesskey) => get(`/api/kyc/contacts/${id}`, accesskey),

    kycContactsDelete: (id, accesskey) => delNoData(`/api/kyc/contacts/${id}`, accesskey),

    kycContactsPost: (contactData, accesskey) => post('/api/kyc/contacts', contactData, accesskey),

    kycContactsPatch: (id, contactData, accesskey) => patch(`/api/kyc/contacts/${id}`, contactData, accesskey),

    kycAccountGet: accesskey => get('/api/kyc/accounts', accesskey),

    kycQuestionnaireGet: accesskey => get('/api/kyc/questionnaire', accesskey),

    kycAccountsPost: (accountData, accesskey) => post('/api/kyc/accounts', accountData, accesskey),

    /**
   * @func getStatistics
   * @param {string} accesskey
   * @param {object} query
   */
    getStatistics: async (accesskey, query = { type: 'dollarsPerOrder', currency: 'TKS' }) => {
      const keys = Object.keys(query);
      let queryString = '?';

      await keys.forEach((key) => {
        const value = query[key];
        if (value !== undefined) queryString = queryString += `${key}=${query[key]}&`;
      });

      return get(`/api/merchant/stats${queryString}`, accesskey);
    },

    getFilteredAddresses: async (APIKey) => {
      const addresses = await PaymentsAPI.withdrawalAddress(null, APIKey);
      const addressArray = Object.keys(addresses).map(key => ({
        currency: key,
        address: addresses[key],
      }));
      const filteredAddressArray = addressArray.filter(address => !!address.address);

      return filteredAddressArray;
    },

    hasValidAddress: async (APIKey) => {
      const userAddresess = await PaymentsAPI.getFilteredAddresses(APIKey);

      return userAddresess && userAddresess.length;
    },
  };

  return PaymentsAPI;
}

module.exports = Payments;
