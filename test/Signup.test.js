const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server/server'); // Update the path as necessary
const { MongoClient } = require("mongodb");

describe('POST /doc_signup', () => {
    let client;
    let db;
    let doc_reg;
    let findOneStub;
    let insertOneStub;

    before(async () => {
        const url = "mongodb+srv://admin:Saiteja123.@cluster0.friabbo.mongodb.net/?retryWrites=true&w=majority";
        client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
        await client.connect();
        db = client.db("Miniproject");
        doc_reg = db.collection("doc_reg");
    });

    after(async () => {
        await client.close();
    });

    beforeEach(() => {
        findOneStub = sinon.stub(doc_reg, 'findOne');
        insertOneStub = sinon.stub(doc_reg, 'insertOne');
    });

    afterEach(() => {
        findOneStub.restore();
        insertOneStub.restore();
    });

    it('should add data when user does not exist', async () => {
        findOneStub.resolves(null); // User does not exist
        insertOneStub.resolves(); // Insertion successful

        const userData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            pass: 'password',
            photo: 'profile.jpg',
            specialization: 'Cardiology'
        };

        const response = await request(app)
            .post('/doc_signup')
            .send(userData);

        expect(response.status).to.equal(409);
        expect(response.text).to.equal('user exists');
        // sinon.assert.calledOnce(findOneStub);
        // sinon.assert.calledWith(findOneStub, { email: userData.email });
        // sinon.assert.calledOnce(insertOneStub);
        // sinon.assert.calledWith(insertOneStub, userData);
    });

    it('should return "user exists" when user already exists', async () => {
        findOneStub.resolves({ email: 'johndoe@example.com' }); // User already exists

        const userData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            pass: 'password',
            photo: 'profile.jpg',
            specialization: 'Cardiology'
        };

        const response = await request(app)
            .post('/doc_signup')
            .send(userData);

        expect(response.status).to.equal(409);
        expect(response.text).to.equal('user exists');
       
    });
});
