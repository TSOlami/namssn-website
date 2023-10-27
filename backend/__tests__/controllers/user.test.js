import supertest from "supertest";
import createServer from "../../utils/server";
import * as userModel from "../../models/userModel";

const app = createServer();

describe('user', () => {
  describe('get user route', () => {
    describe('given the user does not exist', () => {
      it('should return a 404', async () => {
        expect(true).toBe(true);
        // Mock the behavior of User.findById
        userModel.User.findById = jest.fn();
        // Configure the mock behavior for findById
        userModel.User.findById.mockResolvedValue(null); // Mock the response for a user that does not exist

        const userId = 'user-id-1';

        const app = createServer(); // Create the Express app with the mocked behavior

        // Send a GET request to the route
        const response = await supertest(app).get(`/api/v1/users/profile/${userId}`);

        // Expect a 404 response
        expect(response.status).toBe(404);

        // Restore the original behavior of User.findById
        userModel.User.findById.mockRestore();
      });
    });
  });
});
