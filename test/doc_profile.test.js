const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);
const { MongoClient, ObjectId } = require("mongodb");
const {app, doc_reg,jwt,design_schedule,compl_client_appointments,doctor_appointments,client_appointments,doctor_reviews} = require('../server/server');


chai.use(chaiHttp);


// Function to generate a valid JWT token for testing
const generateValidToken = (userId) => {
  const payload = {
    user: {
      id: '65c0cd98e4db4357d1f6c0dd'
    }
  };
  return jwt.sign(payload, '1234-5678');
};

describe('GET /doctor_profile', () => {
    let findOneStub;
    let token;
  
    beforeEach(() => {
      findOneStub = sinon.stub(doc_reg, 'findOne');
      token = generateValidToken('65c0cd98e4db4357d1f6c0dd'); // Generate a valid token for testing
    });
  
    afterEach(() => {
      findOneStub.restore();
    });
  
    it('should return doctor profile if user exists', async () => {
      const doctorProfile = { _id: '65c0cd98e4db4357d1f6c0dd', name: 'Test Doctor', email: 'doctor@example.com', specialization: 'Test Specialization' };
      findOneStub.withArgs({ _id: sinon.match.instanceOf(ObjectId) }).resolves(doctorProfile); // Stub to simulate doctor profile exists
  
      const res = await chai.request(app)
        .get('/doctor_profile')
        .set('x-token', token);
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(doctorProfile);
    });
  
    it('should return "User not found" if doctor profile does not exist', async () => {
      findOneStub.withArgs({ _id: sinon.match.instanceOf(ObjectId) }).resolves(null); // Stub to simulate doctor profile not found
  
      const res = await chai.request(app)
        .get('/doctor_profile')
        .set('x-token', token);
      expect(res).to.have.status(404);
      expect(res.text).to.equal('User not found');
    });
  
    it('should return "Internal Server Error" if an error occurs', async () => {
      findOneStub.rejects(new Error('Mocked error')); // Stub to simulate an error
  
      const res = await chai.request(app)
        .get('/doctor_profile')
        .set('x-token', token);
  
      expect(res).to.have.status(500);
      expect(res.text).to.equal('Internal Server Error');
    });
  });
  


  ////---->Design_Schedule------------------>




  describe('POST /design_schedule', () => {
    let insertOneStub;
    let token;
  
    beforeEach(() => {
      insertOneStub = sinon.stub(design_schedule, 'insertOne');
      token = generateValidToken('65c0cd98e4db4357d1f6c0dd'); // Generate a valid token for testing
    });
  
    afterEach(() => {
      insertOneStub.restore();
    });
  
    it('should add design schedule and return "data added"', async () => {
      const scheduleData = { date: '2024-02-20', freehours: ['9:00', '10:00', '11:00'], doctor_id: '65c0cd98e4db4357d1f6c0dd' };
  
      insertOneStub.resolves({ insertedCount: 1 }); // Stub to simulate successful insertion
  
      const res = await chai.request(app)
        .post('/design_schedule')
        .set('x-token', token)
        .send(scheduleData);
  
      expect(res).to.have.status(200);
      expect(res.text).to.equal('data added');
    });
  
  
    it('should return "Internal Server Error" if an error occurs', async () => {
      const scheduleData = { date: '2024-02-20', freehours: ['9:00', '10:00', '11:00'], doctor_id: '65c0cd98e4db4357d1f6c0dd' };
  
      insertOneStub.rejects(new Error('Mocked error')); // Stub to simulate an error
  
      const res = await chai.request(app)
        .post('/design_schedule')
        .set('x-token', token)
        .send(scheduleData);
  
      expect(res).to.have.status(500);
      expect(res.text).to.equal('Internal Server Error');
    });
  });
  


//----->getting schedule --------------------->


describe('GET /get_schedule', () => {
    let findStub;
    let token;
  
    beforeEach(() => {
      findStub = sinon.stub(design_schedule, 'find');
      token = generateValidToken('65c0cd98e4db4357d1f6c0dd'); // Generate a valid token for testing
    });
  
    afterEach(() => {
      findStub.restore();
    });
  
    it('should return schedule for the authenticated doctor', async () => {
      const scheduleData = [{ _id: '60c0cd98e4db4357d1f6c0dd', date: '2024-02-20', freehours: ['9:00', '10:00', '11:00'], doctor_id: '65c0cd98e4db4357d1f6c0dd' }];
  
      findStub.withArgs({ doctor_id: sinon.match.instanceOf(ObjectId) }).returns({ toArray: () => scheduleData }); // Stub to simulate schedule data exists for the doctor
  
      const res = await chai.request(app)
        .get('/get_schedule')
        .set('x-token', token);
  
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(scheduleData);
    });
  
    it('should return "Internal Server Error" if an error occurs', async () => {
      findStub.rejects(new Error('Mocked error')); // Stub to simulate an error
  
      const res = await chai.request(app)
        .get('/get_schedule')
        .set('x-token', token);
  
      expect(res).to.have.status(500);
      expect(res.text).to.equal('Internal Server Error');
    });
  });
  

////----------->Deleteing Schedule --------------------->



describe('POST /del_schedule', () => {
    let findOneAndDeleteStub;
    let token;
  
    beforeEach(() => {
      findOneAndDeleteStub = sinon.stub(design_schedule, 'findOneAndDelete');
      token = generateValidToken('65c0cd98e4db4357d1f6c0dd'); // Generate a valid token for testing
    });
  
    afterEach(() => {
      findOneAndDeleteStub.restore();
    });
  
    it('should delete the schedule record', async () => {
      const scheduleId = '60c0cd98e4db4357d1f6c0dd';
  
      findOneAndDeleteStub.withArgs({ _id: sinon.match.instanceOf(ObjectId) }).resolves({ value: { _id: scheduleId } }); // Stub to simulate successful deletion
  
      const res = await chai.request(app)
        .post('/del_schedule')
        .set('x-token', token)
        .send({ _id: scheduleId });
  
      expect(res).to.have.status(200);
      expect(res.text).to.equal('record deleted');
    });
  
    it('should return "Internal Server Error" if an error occurs', async () => {
      findOneAndDeleteStub.rejects(new Error('Mocked error')); // Stub to simulate an error
  
      const res = await chai.request(app)
        .post('/del_schedule')
        .set('x-token', token)
        .send({ _id: '60c0cd98e4db4357d1f6c0dd' });
  
      expect(res).to.have.status(500);
      expect(res.text).to.equal('Internal Server Error');
    });
  });
  


///////////////-----------.>>>> Doctors whose traetmenmt is completed ------------------->

// describe('GET /doctor_rating_avg', () => {
//     let findStub;
//     let token;

//     beforeEach(() => {
//         findStub = sinon.stub(doctor_reviews, 'find');
//         token = generateValidToken('65c0cd98e4db4357d1f6c0dd'); // Generate a valid token for testing
//     });

//     afterEach(() => {
//         findStub.restore();
//     });

//     it('should return average rating of the doctor if user exists', async () => {
//         const doctorId = '65c0cd98e4db4357d1f6c0dd'; // Doctor ID for which rating is being fetched
//         const doctorReviews = [
//             { rating: 5 },
//             { rating: 4 },
//             { rating: 3 },
//         ];

//         findStub.withArgs({ doctor_id: sinon.match.instanceOf(ObjectId) }).resolves({ toArray: () => doctorReviews });

//         const res = await chai.request(app)
//             .get('/doctor_rating_avg')
//             .set('x-token', token);

//         expect(res).to.have.status(200);
//         expect(res.body).to.deep.equal(doctorReviews.map(review => review.rating));
//     });

//     it('should return "Unauthorized" if token is missing', async () => {
//         const res = await chai.request(app)
//             .get('/doctor_rating_avg');

//         expect(res).to.have.status(401);
//         expect(res.body).to.deep.equal({ message: "Unauthorized" });
//     });

//     it('should return "Internal Server Error" if an error occurs', async () => {
//         findStub.rejects(new Error('Mocked error'));

//         const res = await chai.request(app)
//             .get('/doctor_rating_avg')
//             .set('x-token', token);

//         expect(res).to.have.status(500);
//         expect(res.text).to.equal('Internal Server Error');
//     });
// });
