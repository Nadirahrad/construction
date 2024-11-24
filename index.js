/*const Contractor = require('./models/Contractor');

require('dotenv').config();
console.log("MongoDB URI:", process.env.MONGODB_URI);

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Database connection
mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());

/*app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/

// Create a new contractor
/*app.post('/contractors', async (req, res) => {
    try {
       const contractor = new Contractor(req.body);
       await contractor.save();
       res.status(201).send(contractor);
    } catch (err) {
       res.status(400).send(err);
    }
 });*/

 /*app.post('/contractors', async (req, res) => {
   try {
      const contractor = new Contractor(req.body);
      await contractor.save();
      res.status(201).send(contractor);
   } catch (err) {
      res.status(400).send({ error: "Invalid contractor data", details: err.message });
   }
});


 //get all contractor
 app.get('/contractors', async (req, res) => {
    try {
       const contractors = await Contractor.find();
       res.send(contractors);
    } catch (err) {
       res.status(500).send(err);
    }
 });
 
 //update a contractor by ID
 app.put('/contractors/:id', async (req, res) => {
    try {
       const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
       if (!contractor) {
          return res.status(404).send();
       }
       res.send(contractor);
    } catch (err) {
       res.status(400).send(err);
    }
 });

 
 //delete a contractor by ID
 app.delete('/contractors/:id', async (req, res) => {
    try {
       const contractor = await Contractor.findByIdAndDelete(req.params.id);
       if (!contractor) {
          return res.status(404).send();
       }
       res.send(contractor);
    } catch (err) {
       res.status(500).send(err);
    }
 });

 
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  

  const User = require('./models/User');
const jwt = require('jsonwebtoken');

// User Registration
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).send({ error: 'Registration failed', details: err.message });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
        res.send({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).send({ error: 'Login failed', details: err.message });
    }
});


const authenticate = (req, res, next) => {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) {
       return res.status(401).send({ error: 'Access denied' });
   }
   try {
       const decoded = jwt.verify(token, 'your_jwt_secret');
       req.userId = decoded.userId;
       next();
   } catch (err) {
       res.status(401).send({ error: 'Invalid token' });
   }
};

// Example of protecting a route
app.get('/contractors', authenticate, async (req, res) => {
   try {
       const contractors = await Contractor.find();
       res.send(contractors);
   } catch (err) {
       res.status(500).send(err);
   }
});
*/

/*require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // Ensure bcrypt is imported
const jwt = require('jsonwebtoken');  // Only import jwt once

const Contractor = require('./models/Contractor');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());

// Authentication middleware
const authenticate = (req, res, next) => {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) {
      return res.status(401).send({ error: 'Access denied' });
   }
   try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.userId = decoded.userId;
      next();
   } catch (err) {
      res.status(401).send({ error: 'Invalid token' });
   }
};

// User Registration
app.post('/register', async (req, res) => {
   try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send({ message: 'User registered successfully' });
   } catch (err) {
      res.status(400).send({ error: 'Registration failed', details: err.message });
   }
});

// User Login
app.post('/login', async (req, res) => {
   try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !await bcrypt.compare(password, user.password)) {
         return res.status(400).send({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' }); // Token expires in 1 hour;
      res.send({ message: 'Login successful', token });
   } catch (err) {
      res.status(500).send({ error: 'Login failed', details: err.message });
   }
});

// Contractor routes (CRUD) - Protected routes
app.post('/contractors', authenticate, async (req, res) => {  // Only authenticated users can create contractors
   try {
      const contractor = new Contractor(req.body);
      await contractor.save();
      res.status(201).send(contractor);
   } catch (err) {
      res.status(400).send({ error: "Invalid contractor data", details: err.message });
   }
});

app.get('/contractors', authenticate, async (req, res) => {
   try {
      const contractors = await Contractor.find();
      res.send(contractors);
   } catch (err) {
      res.status(500).send(err);
   }
});

// Update contractor by ID
app.put('/contractors/:id', authenticate, async (req, res) => {
   try {
       const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
       if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
       res.send(contractor);
   } catch (err) {
       res.status(400).send({ error: "Failed to update contractor", details: err.message });
   }
});

// Delete contractor by ID
app.delete('/contractors/:id', authenticate, async (req, res) => {
   try {
       const contractor = await Contractor.findByIdAndDelete(req.params.id);
       if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
       res.send({ message: 'Contractor deleted successfully' });
   } catch (err) {
       res.status(500).send({ error: "Failed to delete contractor", details: err.message });
   }
});



app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});*/

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const Contractor = require('./models/Contractor');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
/*mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.error("MongoDB connection error:", error));*/
   mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("Connected to MongoDB"))
   .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { title: 'Contractor CRM API', version: '1.0.0', description: 'API Documentation for Contractor CRM',
         },
         components: {
            schemas: {
              Contractor: {
                type: 'object',
                required: ['name', 'company', 'contact', 'licenseExpiry'],
                properties: {
                  name: { type: 'string' },
                  company: { type: 'string' },
                  contact: { type: 'string' },
                  licenseExpiry: { type: 'string', format: 'date' },
                },
              },
            },
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
          security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Authentication middleware
const authenticate = (req, res, next) => {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) {
      return res.status(401).send({ error: 'Access denied' });
   }
   try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.userId = decoded.userId;
      next();
   } catch (err) {
      res.status(401).send({ error: 'Invalid token' });
   }
};


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 */

// User Registration
app.post('/register', async (req, res) => {
   try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send({ message: 'User registered successfully' });
   } catch (err) {
      res.status(400).send({ error: 'Registration failed', details: err.message });
   }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */

// User Login with token expiration
app.post('/login', async (req, res) => {
   try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !await bcrypt.compare(password, user.password)) {
         return res.status(400).send({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.send({ message: 'Login successful', token });
   } catch (err) {
      res.status(500).send({ error: 'Login failed', details: err.message });
   }
});

/**
 * @swagger
 * /contractors:
 *   post:
 *     summary: Create a contractor
 *     tags: [Contractor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contractor'
 *     responses:
 *       201:
 *         description: Contractor created successfully
 *       400:
 *         description: Invalid contractor data
 */

// Contractor routes
app.post('/contractors', authenticate, async (req, res) => {
   try {
      const contractor = new Contractor(req.body);
      await contractor.save();
      res.status(201).send(contractor);
   } catch (err) {
      res.status(400).send({ error: "Invalid contractor data", details: err.message });
   }
});

/**
 * @swagger
 * /contractors:
 *   get:
 *     summary: Get all contractors
 *     tags: [Contractor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of contractors
 *       401:
 *         description: Access denied
 */

app.get('/contractors', authenticate, async (req, res) => {
   try {
      const contractors = await Contractor.find();
      res.send(contractors);
   } catch (err) {
      res.status(500).send(err);
   }
});

/**
 * @swagger
 * /contractors/{id}:
 *   put:
 *     summary: Update a contractor
 *     tags: [Contractor]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Contractor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contractor updated successfully
 *       404:
 *         description: Contractor not found
 *       500:
 *         description: Internal server error
 */

// Update contractor by ID
app.put('/contractors/:id', authenticate, async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
        res.send(contractor);
    } catch (err) {
        res.status(400).send({ error: "Failed to update contractor", details: err.message });
    }
});

/**
 * @swagger
 * /contractors/{id}:
 *   delete:
 *     summary: Delete a contractor
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the contractor to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contractor deleted successfully
 *       404:
 *         description: Contractor not found
 */

// Delete contractor by ID
app.delete('/contractors/:id', authenticate, async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndDelete(req.params.id);
        if (!contractor) return res.status(404).send({ error: 'Contractor not found' });
        res.send({ message: 'Contractor deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: "Failed to delete contractor", details: err.message });
    }
});

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

// Test commit for Git hook
