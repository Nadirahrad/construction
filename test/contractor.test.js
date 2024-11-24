/*const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); // Adjust this path as needed
const jwt = require('jsonwebtoken');*/

/*jest.spyOn(console, 'log').mockImplementation(() => {});

describe('POST /contractors', () => {
    let token;

    beforeAll((done) => {
        // Login to get token
        request(app)
            .post('/login')
            .send({ username: 'testUser', password: 'testPassword' })
            .end((err, res) => {
                if (err) return done(err);
                token = res.body.token;
                done();
            });
    });

    it('should create a new contractor', (done) => {
        request(app)
            .post('/contractors')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Jane Doe', company: 'Doe Ltd', contact: '123-456-7890', licenseExpiry: '2025-12-31' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay to ensure all async processes complete
});*/

/*describe('POST /contractors', () => {
    let token;

    beforeAll(() => {
        // Generate a valid JWT token using the same secret as your app
        token = jwt.sign({ userId: 'testUserId' }, 'n1a2d3r4', { expiresIn: '1h' });
    });

    it('should create a new contractor', async () => {
        const res = await request(app)
            .post('/contractors')
            .set('Authorization', `Bearer ${token}`) // Use the token here
            .send({
                name: 'Jane Doe',
                company: 'Doe Ltd',
                contact: '123-456-7890',
                licenseExpiry: '2025-12-31',
            })
            .expect(201); // Expect HTTP status 201 Created

        expect(res.body).toHaveProperty('_id'); // Adjust based on your API response structure
        expect(res.body.name).toBe('Jane Doe');
    });
});*/

/*const app = require('../app'); // Sesuaikan laluan ke fail app.js
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let token; // Token global untuk ujian
let contractorId;


beforeAll(async () => {
    // Menjana token JWT sah untuk ujian
    token = jwt.sign(
        { userId: 'dummyUserId' }, // Gunakan ID pengguna dummy
        process.env.JWT_SECRET || 'n1a2d3r4', // Rahsia JWT
        { expiresIn: '1h' }
    );

    // Sambung ke pangkalan data MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Tutup sambungan pangkalan data selepas ujian selesai
    await mongoose.connection.close();
});

afterEach(async () => {
    await mongoose.connection.collection('contractors').deleteMany({});
});*/

/*describe('Contractors API Test', () => {
    //POST Test
    it('should create a new contractor', async () => {
        const response = await request(app)
            .post('/contractors') // Endpoint yang diuji
            .set('Authorization', `Bearer ${token}`) // Tambah token ke header Authorization
            .send({
                name: 'Jane Doe',
                company: 'Doe Ltd',
                contact: '123-456-7890',
                licenseExpiry: '2025-12-31'
            })
            .expect(201); // Status yang dijangka

            contractorId = response.body._id; //Store the contractor ID for other tests

        // Ujian tambahan untuk memastikan data yang dihantar betul
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe('Jane Doe');
    });

    it('should return 400 for missing required fields', async () => {
        await request(app)
            .post('/contractors')
            .set('Authorization', `Bearer ${token}`)
            .send({ company: 'Invalid Ltd' }) // Missing 'name'
            .expect(400); // Expecting a bad request status
    });

     // GET Test
     it('should retrieve the list of contractors', async () => {
        const response = await request(app)
            .get('/contractors')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    _id: contractorId,
                    name: 'Jane Doe',
                    company: 'Doe Ltd',
                }),
            ])
        );
    });
    

    // PUT Test
    it('should update the contractor details', async () => {
        const updatedData = {
            name: 'Jane Updated',
            company: 'Updated Ltd',
            contact: '987-654-3210',
            licenseExpiry: '2026-12-31'
        };

        const response = await request(app)
            .put(`/contractors/${contractorId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData)
            .expect(200); // Expect HTTP 200 OK

        expect(getResponse.body.name).toBe('Jane Updated');
        expect(getResponse.body.company).toBe('Updated Ltd');
    });

    // DELETE Test
it('should delete the contractor', async () => {
    await request(app)
        .delete(`/contractors/${contractorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200); // Expect HTTP 200 OK

    // Verify the contractor was deleted
    const response = await request(app)
        .get('/contractors')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    expect(response.body).not.toEqual(
        expect.arrayContaining([
            expect.objectContaining({ _id: contractorId }),
        ])
    );
});*/

/*describe('Contractors API Tests', () => {
    // POST Test
    it('should create a new contractor', async () => {
        const response = await request(app)
            .post('/contractors')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Jane Doe',
                company: 'Doe Ltd',
                contact: '123-456-7890',
                licenseExpiry: '2025-12-31'
            })
            .expect(201); // Expect HTTP 201 Created

        contractorId = response.body._id; // Store the contractor ID for other tests

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe('Jane Doe');
    });

    // GET Test
    it('should retrieve the list of contractors', async () => {
        const response = await request(app)
            .get('/contractors')
            .set('Authorization', `Bearer ${token}`)
            .expect(200); // Expect HTTP 200 OK

        expect(Array.isArray(response.body)).toBe(true); // Ensure response is an array
        expect(response.body.length).toBeGreaterThan(0); // Ensure at least one contractor exists
    });

    // PUT Test
    it('should update the contractor details', async () => {
        const updatedData = {
            name: 'Jane Updated',
            company: 'Updated Ltd',
            contact: '987-654-3210',
            licenseExpiry: '2026-12-31'
        };

        const response = await request(app)
            .put(`/contractors/${contractorId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData)
            .expect(200); // Expect HTTP 200 OK

        expect(response.body.name).toBe('Jane Updated');
        expect(response.body.company).toBe('Updated Ltd');
    });

    // DELETE Test
    it('should delete the contractor', async () => {
        await request(app)
            .delete(`/contractors/${contractorId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200); // Expect HTTP 200 OK

        // Verify the contractor was deleted
        const response = await request(app)
            .get(`/contractors/${contractorId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404); // Expect HTTP 404 Not Found
    });
});*/

const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let token;
let contractorId;

beforeAll(async () => {
    token = jwt.sign({ userId: 'dummyUserId' }, process.env.JWT_SECRET || 'n1a2d3r4', { expiresIn: '1h' });

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    const contractor = await mongoose.connection.collection('contractors').insertOne({
        name: 'Sample Contractor',
        company: 'Sample Ltd',
        contact: '123-456-7890',
        licenseExpiry: '2025-12-31',
    });
    contractorId = contractor.insertedId.toString();
});

afterEach(async () => {
    await mongoose.connection.collection('contractors').deleteMany({});
});

describe('Contractors API Tests', () => {
    it('should create a new contractor', async () => {
        const response = await request(app)
            .post('/contractors')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Jane Doe',
                company: 'Doe Ltd',
                contact: '987-654-3210',
                licenseExpiry: '2025-12-31',
            })
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe('Jane Doe');
    });

    it('should retrieve the list of contractors', async () => {
        const response = await request(app)
            .get('/contractors')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toEqual(
            expect.arrayContaining([expect.objectContaining({ _id: contractorId })])
        );
    });

    it('should update the contractor details', async () => {
        const updatedData = {
            name: 'Updated Name',
            company: 'Updated Ltd',
            contact: '111-222-3333',
            licenseExpiry: '2026-12-31',
        };

        const response = await request(app)
            .put(`/contractors/${contractorId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.name).toBe('Updated Name');
        expect(response.body.company).toBe('Updated Ltd');
    });

    it('should delete the contractor', async () => {
        await request(app)
            .delete(`/contractors/${contractorId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const response = await request(app)
            .get(`/contractors/${contractorId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
