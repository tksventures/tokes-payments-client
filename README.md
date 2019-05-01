# Tokes Payments Client
Module to communicate with the [Tokes Payments API](https://documenter.getpostman.com/view/3333316/RVu2nqbn)

### Prerequisites
You will need access to a Tokes Payments API server and at least one valid API key registered on this server.

### Installation
```
npm install tokes-payments-client
```
This will install the package to your current working directory

### Configuration
```js
import TokesPaymentsClient from 'tokes-payments-client';

const client = TokesPaymentsClient({
    host: PAYMENT_SERVER,
});
```

| Key | Description |
| --- | --- |
| `host` | URL where a Tokes Payments API server is running |
| `apiKey` | _(Optional)_ A default API Key to use on all requests |
| `serviceKey` | _(Optional)_ Additional key sent with headers (`appkey`) for client signatures |

### Testing
When developing extensions to the package, run the following command locally.

```
npm test
```

## Usage
- All API methods return promises so you will need to handle them as such in your code.
- If a request fails, or an error occurs, the client will throw an error that should be caught by your app.
- If a request succeeds, the result will be the response data as shown in the [Tokes Payments API Documentation](https://documenter.getpostman.com/view/3333316/RVu2nqbn).

#### Example
```js
import TokesPaymentsClient from 'tokes-payments-client';

const { PAYMENT_SERVER, API_KEY } = process.env;
const client = TokesPaymentsClient({
    host: PAYMENT_SERVER,
    apiKey: API_KEY,
});

const orderData = {
  total: 4.20,
  items: [
    {
      name: 'Test Product',
      price: '4.20',
    },
  ],
  currency: 'LTC',
};

client.payment(orderData).then(console.log);

/*
{
  success: true,
  order: {
    total: 4.20,
    items: [
      {
        name: 'Test Product',
        price: '4.20',
      },
    ],
    currency: 'LTC',
    reference_id: '29665368466981300645440621238781',
    id: '5cc9d3e2f017aa0018c07730',
    subtotal: 4.20,
    tax: 0,
    rates: {
      TKS: '11.33581530',
      BTC: '0.00078342',
      LTC: '0.05720475',
    },
    last_payment_id: '5cc9d3e2f017aa0018c07731',
  },
  payment: {
    gross_amount: 5720475,
    payment_status_id: 0,
    payment_address: 'n39vb52JAHbBjAnGmcweggUEysgkDhSsm7',
    seller_address: 'tltc1q3mdcx97uufafrx309wxt4m0pn02lwrl97zzsqy',
    currency: 'LTC',
    id: '5cc9d3e2f017aa0018c07731',
  },
  message: 'Created payment',
}
*/
```
