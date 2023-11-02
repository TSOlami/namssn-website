import supertest from "supertest";
import createServer from "../../utils/server";

const newApp = createServer();

describe('resource', () => {
  describe('get resource route', ( ) => {
    describe('given the resource does not exist', () => {
      it('should return a 404', () => {
         expect(true).toBe(true);
      })
    })
    describe('given the resource exists', () => {
      it('should return a 202', async () => {
        await supertest(newApp).get(`api/v1/users/resources/`).expect(202)
      })
    })
  })
  describe('post resource route', ( ) => {

  })
});