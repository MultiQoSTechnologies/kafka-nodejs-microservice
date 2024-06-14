const produceMessage = require('./kafkaProducer');
const consumeMessages = require('./kafkaConsumer');

let usersData = [
  {
    id: 'kkco4ddgc',
    username: 'john_doe',
    password: 'securepassword',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    city: 'Mumbai',
    createdAt: '2023-01-15T10:00:00Z'
  },
 
  {
    id: 'lgsrdj08n',
    username: 'jane_smith',
    password: 'anothersecurepassword',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    city: 'London',
    createdAt: '2023-02-20T14:30:00Z'
  },
   {
    id: 'gtcoj65gc',
    username: 'm_polra',
    password: 'Maulik123',
    email: 'maulik@yopmail.com',
    fullName: 'Maulik Polra',
    city: 'Mumbai',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: 'tv91we5mi',
    username: 'alice_jones',
    password: 'yetanotherpassword',
    email: 'alice.jones@example.com',
    fullName: 'Alice Jones',
    city: 'Mumbai',
    createdAt: '2023-03-10T08:45:00Z'
  },
  {
    id: 'o8p480d87',
    username: 'bob_brown',
    password: 'password123',
    email: 'bob.brown@example.com',
    fullName: 'Bob Brown',
    city: 'Ahmadabad',
    createdAt: '2023-04-05T09:15:00Z'
  },
  {
    id: '24ni6qe38',
    username: 'charlie_davis',
    password: 'supersecure',
    email: 'charlie.davis@example.com',
    fullName: 'Charlie Davis',
    city: 'Ahmadabad',
    createdAt: '2023-05-25T12:00:00Z'
  },
  {
    id: 'w15lx6sms',
    username: 'dave_evans',
    password: 'mypassword',
    email: 'dave.evans@example.com',
    fullName: 'Dave Evans',
    city: 'Chennai',
    createdAt: '2023-06-12T15:30:00Z'
  },
  {
    id: 'yrgo8w0y9',
    username: 'eve_harris',
    password: 'verysecure',
    email: 'eve.harris@example.com',
    fullName: 'Eve Harris',
    city: 'Delhi',
    createdAt: '2023-07-01T08:00:00Z'
  },
  {
    id: 'wp3ym1oqr',
    username: 'frank_green',
    password: 'securepass',
    email: 'frank.green@example.com',
    fullName: 'Frank Green',
    city: 'Chennai',
    createdAt: '2023-08-15T09:45:00Z'
  },
  {
    id: 'nw89dz27p',
    username: 'grace_lee',
    password: 'passwordsecure',
    email: 'grace.lee@example.com',
    fullName: 'Grace Lee',
    city: 'Dubai',
    createdAt: '2023-09-25T11:20:00Z'
  },
  {
    id: 'uqg8fmtjvt',
    username: 'hank_miller',
    password: 'superpassword',
    email: 'hank.miller@example.com',
    fullName: 'Hank Miller',
    city: 'Rajkot',
    createdAt: '2023-10-30T16:10:00Z'
  },
  {
    id: 'ck8fmtreal',
    username: 'md_polra',
    password: 'Maulik123',
    email: 'maulik.miller@example.com',
    fullName: 'Maulik polra',
    city: 'Amreli',
    createdAt: '2023-10-30T16:10:00Z'
  }
];

// Login API
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = usersData.find(user => user.username === username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Send the login event to Kafka
    const topic = 'UserLoggedIn';
    console.log(`User ${user.id} logged in successful.`);
    const result = await produceMessage(topic, { id: user.id, username: user.username });

    res.json({ success: true, data: { id: user.id, username: user.username }, kafkaResult: result });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Error logging in user' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = req.body;
    newUser.id = Math.random().toString(36).substr(2, 9);
    newUser.createdAt = new Date().toISOString();
    usersData.push(newUser);
    console.log(`User ${newUser.id} created in.`);

    // Send the user creation event to Kafka
    const topic = 'UserCreated'; // Define your topic
    const result = produceMessage(topic, newUser);

    res.json({ success: true, data: newUser, kafkaResult: result });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const topic = 'UserDataList'; // Define your topic
    const result = produceMessage(topic, usersData);

    res.json({ success: true, data: usersData, kafkaResult: result });
  } catch (error) {
    res.status(500).json({ error: 'Error getting users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    // Find the user with the provided ID in the placeholder data
    const user = usersData.find(user => user.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const topic = 'UserViewProfile'; // Define your topic
    const result = produceMessage(topic, user);

     res.json({ success: true, data: user, kafkaResult: result });
  } catch (error) {
    res.status(500).json({ error: 'Error getting user' });
  }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  try {
    const topic = 'UserProfileUpdate'; // Define your topic
    const userId = req.params.id;
    const updatedData = req.body;


    // Find the user with the provided ID in the placeholder data
    const index = usersData.findIndex(user => user.id === userId);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    updatedData.createdAt = usersData[index].createdAt;
    // Update the user's data
    usersData[index] = { ...usersData[index], ...updatedData };

    const result = produceMessage(topic, usersData[index]);

    res.json({ success: true, data: usersData[index], kafkaResult: result });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    // Filter out the user with the provided ID from the placeholder data
    usersData = usersData.filter(user => user.id !== userId);

    const topic = 'UserDeleted'; // Define your topic
    const result = produceMessage(topic, { id: userId }); // Produce message with userId

    res.json({ success: true, message: 'User deleted successfully', kafkaResult: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};
//handling received message 
// const consumerGroupId = 'my-group';
// const topics = ['UserLoggedIn', 'UserDataList', 'UserViewProfile', 'UserProfileUpdate'];
// consumeMessages(topics,consumerGroupId)