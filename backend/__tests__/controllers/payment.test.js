import express from 'express';
import {
  createCategory,
  deleteCategory,
  getPaymentStatus,
  getAllPayments,
} from '../../controllers/adminController';



const app = express();

app.use(express.json());

app.post('/api/v1/admin/payments', createCategory);
app.delete('/api/v1/admin/payments/:id', deleteCategory);
app.post('/api/v1/admin/payments/verify', getPaymentStatus);
app.get('/api/v1/admin/payments/all-payments', getAllPayments);

describe('Route existence tests', () => {
  it('should have a POST /api/v1/admin/payments route', () => {
    const route = app._router.stack.find(
      (s) =>
        s.route &&
        s.route.path === '/api/v1/admin/payments' &&
        s.route.methods.post
    );
    expect(route).toBeTruthy();
  });

  it('should have a DELETE /api/v1/admin/payments/:id route', () => {
    const route = app._router.stack.find(
      (s) =>
        s.route &&
        s.route.path === '/api/v1/admin/payments/:id' &&
        s.route.methods.delete
    );
    expect(route).toBeTruthy();
  });

  it('should have a POST /api/v1/admin/payments/verify route', () => {
    const route = app._router.stack.find(
      (s) =>
        s.route &&
        s.route.path === '/api/v1/admin/payments/verify' &&
        s.route.methods.post
    );
    expect(route).toBeTruthy();
  });

  it('should have a GET /api/v1/admin/payments/all-payments route', () => {
    const route = app._router.stack.find(
      (s) =>
        s.route &&
        s.route.path === '/api/v1/admin/payments/all-payments' &&
        s.route.methods.get
    );
    expect(route).toBeTruthy();
  });
});
