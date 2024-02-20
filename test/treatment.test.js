const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server/server'); // Update the path as necessary
const { MongoClient, ObjectId } = require('mongodb');

describe('POST /treated', () => {
    let client;
    let db;
    let doctor_appointments;
    let compl_client_appointments;
    let compl_doctor_appointments;
    let client_appointments;
    let findOneStub;
    let insertOneStub;
    let findOneAndDeleteStub;

    before(async () => {
        const url = "mongodb+srv://admin:Saiteja123.@cluster0.friabbo.mongodb.net/?retryWrites=true&w=majority";
        client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
        await client.connect();
        db = client.db("Miniproject");
        doctor_appointments = db.collection("doctor_appointments");
        compl_client_appointments = db.collection("compl_client_appointments");
        compl_doctor_appointments = db.collection("compl_doctor_appointments");
        client_appointments = db.collection("client_appointments");
    });

    after(async () => {
        await client.close();
    });

    beforeEach(() => {
        findOneStub = sinon.stub(doctor_appointments, 'findOne');
        insertOneStub = sinon.stub(compl_client_appointments, 'insertOne');
        insertOneStub = sinon.stub(compl_doctor_appointments, 'insertOne');
        findOneAndDeleteStub = sinon.stub(client_appointments, 'findOneAndDelete');
        findOneAndDeleteStub = sinon.stub(doctor_appointments, 'findOneAndDelete');
    });

    afterEach(() => {
        findOneStub.restore();
        insertOneStub.restore();
        findOneAndDeleteStub.restore();
    });

    it('should mark appointment as treated and move it to completed appointments', async () => {
        const appointmentId = '65bb7ccf876c0385f5e143d1';
        const appointmentData = {
            _id: new ObjectId(appointmentId),
            // Mock other fields as necessary
        };

        findOneStub.resolves(appointmentData);

        const response = await request(app)
            .post('/treated')
            .send({ id: appointmentId });

        expect(response.status).to.equal(200);
      
    });

    
});
