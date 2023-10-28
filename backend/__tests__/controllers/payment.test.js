import request from 'supertest';
import express from 'express';
import {
  createCategory,
  deleteCategory,
  getPaymentStatus,
  getAllPayments,
} from '../../controllers/adminController'; // Import your admin route handlers here
import { postUserPayment,getPaymentOptions, verifyUserPayment } from '../../controllers/userController'; //  Import your user route handlers here

let app;

beforeAll(() => {
  // Create and set up the Express app before all tests
  app = express();
  app.use(express.json()); // Add JSON parsing middleware
  // Defining admin routes and use the corresponding route handlers
  app.post('/api/v1/admin/payments', createCategory);
  app.delete('/api/v1/admin/payments/:id', deleteCategory);
  app.post('/api/v1/admin/payments/verify', getPaymentStatus);
  app.get('/api/v1/admin/payments/all-payments', getAllPayments);
});

afterAll((done) => {
  // Close the Express app after all tests are done
  if (app) {
    app.close((err) => {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  } else {
    done();
  }
});


// describe('payment', () => {
//   describe('get payment route', ( ) => {
//     describe('given the payment does not exist', () => {
//       it('should return a 404', () => {
//          expect(true).toBe(true);
//       })
//     })
//   })
// });

describe('POST /api/v1/admin/payments', () => {
  it('should create a new payment category', async () => {
    const response = await request(app)
      .post('/api/v1/admin/payments')
      .send({ name: 'Test Category', session: '2023', amount: 100 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Test Category');
    expect(response.body).toHaveProperty('session', '2023');
    expect(response.body).toHaveProperty('amount', 100);
  });

  it('should return an error when required data is missing', async () => {
    const response = await request(app)
      .post('/api/v1/admin/payments')
      .send({ session: '2023', amount: 100 });

    expect(response.status).toBe(400); // Assuming you return a 400 status for validation errors
  });

  // Add more tests for createCategory route as needed
});

describe('DELETE /api/v1/admin/payments/:id', () => {
  it('should delete a payment category', async () => {
    // Create a category, get its ID, and then delete it
    const createResponse = await request(app)
      .post('/api/v1/admin/payments')
      .send({ name: 'Test Category', session: '2023', amount: 100 });

    const categoryId = createResponse.body._id;

    const deleteResponse = await request(app).delete(
      `/api/v1/admin/payments/${categoryId}`
    );

    expect(deleteResponse.status).toBe(200);
  });

  it('should return an error when the category does not exist', async () => {
    const response = await request(app).delete('/api/v1/admin/payments/nonexistentId');

    expect(response.status).toBe(404);
  });

  // Will add more tests for deleteCategory route as needed
});

describe('POST /api/v1/admin/payments/verify', () => {
  it('should verify payment status', async () => {
    // // Will add more tests forverify payment route as needed
  });

  // Add more tests for getPaymentStatus route as needed
});

describe('GET /api/v1/admin/payments/all-payments', () => {
  it('should get all payment records', async () => {
    // Will add more tests for getting payment records route as needed
  });

  // Add more tests for getAllPayments route as needed
});

// for users 
describe('GET /api/v1/users/payments/:userId', () => {
  it('should get payments for a specific user', async () => {
    // Assuming a user ID exists and there are payments for this user
    const userId = 'user123'; // Replace 'user123' with a valid user ID
    const response = await request(app).get(`/api/v1/users/payments/${userId}`);

    expect(response.status).toBe(200);
    // Assert other response properties or specific user payments
    // For example: expect(response.body).toHaveLength(1);
  });

  it('should return 404 for a user with no payments', async () => {
    // Assuming a user ID exists but no payments are available
    const userId = 'userWithoutPayments'; // Replace with a valid user ID without payments
    const response = await request(app).get(`/api/v1/users/payments/${userId}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'No payments found for this user.' });
  });

  // will add more tests for getUserPayments route as needed
});

describe('POST /api/v1/users/payments', () => {
  it('should initiate a payment for the user', async () => {
    // Create a payment for a specific user
    const response = await request(app).post('/api/v1/users/payments');

    expect(response.status).toBe(200);
    // Assert other response properties or payment initiation success
  });

  //Will add more tests for postUserPayment route as needed
});

describe('POST /api/v1/users/payments/verify', () => {
  it('should verify a user payment', async () => {
    // Assuming the verification process is successful
    const response = await request(app).post('/api/v1/users/payments/verify');

    expect(response.status).toBe(200);
    // Assert other response properties or successful payment verification
  });

  // Will add more tests for verifyUserPayment route as needed
});

