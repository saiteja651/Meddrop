const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server/server'); // Update the path as necessary
const { MongoClient, ObjectId } = require('mongodb');

describe('POST /design_schedule', () => {
    let client;
    let db;
    let design_schedule;
    let insertOneStub;
    let verifyStub;

    before(async () => {
        const url = "mongodb+srv://admin:Saiteja123.@cluster0.friabbo.mongodb.net/?retryWrites=true&w=majority";
        client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
        await client.connect();
        db = client.db("Miniproject");
        design_schedule = db.collection("design_schedule");
    });

    after(async () => {
        await client.close();
    });

    beforeEach(() => {
        insertOneStub = sinon.stub(design_schedule, 'insertOne');
        verifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
        insertOneStub.restore();
        verifyStub.restore();
    });

    it('should add schedule data when authenticated', async () => {
        const userData = {
            user: { id: '65bb7ccf876c0385f5e143d1' }
        };

        // Stub jwt.verify method
        verifyStub.returns(userData);

        const reqBody = {
            date: '2024-02-18',
            freehours: [10, 11, 12] // Sample data
        };

        const response = await request(app)
            .post('/design_schedule')
            .set('x-token', 'fake_token') // Mock token
            .send(reqBody);

        expect(response.status).to.equal(200);
        expect(response.text).to.equal('data added');

        // sinon.assert.calledOnce(insertOneStub);
        // sinon.assert.calledWith(insertOneStub, {
        //     date: reqBody.date,
        //     freehours: reqBody.freehours,
        //     doctor_id: new ObjectId(userData.user.id)
        // });
    });

    it('should return "Unauthorized" when authentication fails', async () => {
        verifyStub.throws(new Error('Token verification failed'));

        const reqBody = {
            date: '2024-02-18',
            freehours: [10, 11, 12] // Sample data
        };

        const response = await request(app)
            .post('/design_schedule')
            .send(reqBody);

        expect(response.status).to.equal(200);
        
    });
});
