import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../routes/userRoutes.js';

const expect = chai.expect;

chai.use(chaiHttp);
describe('User Routes', () => {
	describe('POST /api/v1/users/auth', () => {
	  it('should authenticate a user and return a token', (done) => {
		chai
		  .request(app)
		  .post('/api/v1/users/auth')
		  .send({
			email: 'user@example.com', // Provide a valid user's email
			password: 'password123', // Provide the correct password
		  })
		  .end((err, res) => {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('token');
			done();
		  });
	  });
  
	  it('should return an error for invalid credentials', (done) => {
		chai
		  .request(app)
		  .post('/api/v1/users/auth')
		  .send({
			email: 'user@example.com', // Provide a valid user's email
			password: 'incorrectpassword', // Provide an incorrect password
		  })
		  .end((err, res) => {
			expect(res).to.have.status(401);
			expect(res.body).to.have.property('message');
			done();
		  });
	  });
	});
  
	describe('POST /api/v1/users', () => {
	  it('should register a new user and return a token', (done) => {
		chai
		  .request(app)
		  .post('/api/v1/users')
		  .send({
			name: 'New User',
			username: 'newuser',
			email: 'newuser@example.com', // Provide a unique email
			password: 'password123',
			role: 'user',
			level: '1',
			profilePicture: 'default.jpg',
		  })
		  .end((err, res) => {
			expect(res).to.have.status(201);
			expect(res.body).to.have.property('token');
			done();
		  });
	  });
  
	  it('should return an error for an existing email or username', (done) => {
		chai
		  .request(app)
		  .post('/api/v1/users')
		  .send({
			name: 'Existing User',
			username: 'existinguser', // Provide an existing username
			email: 'user@example.com', // Provide an existing email
			password: 'password123',
			role: 'user',
			level: '1',
			profilePicture: 'default.jpg',
		  })
		  .end((err, res) => {
			expect(res).to.have.status(400);
			expect(res.body).to.have.property('message');
			done();
		  });
	  });
	});
  describe('POST /api/v1/users/logout', () => {
    it('should log out a user', (done) => {
      // Log in a user to obtain a token
      chai
        .request(app)
        .post('/api/v1/users/auth')
        .send({
          email: 'user@example.com', // Provide a valid user's email
          password: 'password123', // Provide the correct password
        })
        .end((err, loginRes) => {
          const token = loginRes.body.token;
  
          // Perform a logout request using the obtained token
          chai
            .request(app)
            .post('/api/v1/users/logout')
            .set('Authorization', `Bearer ${token}`)
            .end((logoutErr, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('message', 'User Logged Out');
              done();
            });
        });
    });
  
    it('should return an error for unauthorized access', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/logout')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});
