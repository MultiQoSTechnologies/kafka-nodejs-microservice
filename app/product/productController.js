const produceProductMessage = require('./kafkaProducer');
const { v4: uuidv4 } = require('uuid');

let products = [
  {
    id: 'a5010030-bd82-4',
    name: 'Smartphone',
    category: 'Electronics',
    price: 599.99,
    description: 'A high-quality smartphone with advanced features.',
    brand: 'ABC Electronics',
    color: 'Black',
    screenSize: '6.5 inches',
    storage: '128GB',
    camera: 'Triple camera setup',
    RAM: '8GB',
    availability: 'In stock',
    rating: 4.5
  },
  {
    id: 'i9921e8d-2e7d-4d',
    name: 'Laptop',
    category: 'Electronics',
    price: 1299.99,
    description: 'Powerful laptop for work and entertainment.',
    brand: 'XYZ Technologies',
    screenSize: '15.6 inches',
    processor: 'Intel Core i7',
    RAM: '16GB',
    storage: '512GB SSD',
    graphicsCard: 'NVIDIA GeForce RTX 3060',
    availability: 'Out of stock',
    rating: 4.8
  },

  {
    id: 'b6577de3-4f9d-4a',
    name: 'Smart TV',
    category: 'Electronics',
    price: 899.99,
    description: 'Ultra HD smart TV with stunning picture quality.',
    brand: 'TechVision',
    screenSize: '55 inches',
    resolution: '4K UHD',
    smartFeatures: ['Built-in Wi-Fi', 'Voice control'],
    connectivity: ['HDMI', 'USB', 'Ethernet'],
    availability: 'In stock',
    rating: 4.7
  },
  {
    id: 'c436cd72-7e6b-4c',
    name: 'Tablet',
    category: 'Electronics',
    price: 349.99,
    description: 'Portable tablet for productivity and entertainment.',
    brand: 'TabTech',
    screenSize: '10.1 inches',
    operatingSystem: 'Android',
    storage: '64GB',
    batteryLife: 'Up to 12 hours',
    availability: 'Out of stock',
    rating: 4.2
  },

  {
    id: 'h2860d7c-5e5c-4a',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: 99.99,
    description: 'True wireless earbuds for immersive audio experience.',
    brand: 'AudioPro',
    color: 'White',
    connectivity: 'Bluetooth 5.1',
    batteryLife: 'Up to 8 hours',
    availability: 'In stock',
    rating: 4.6
  },
  {
    id: 'd1039ac1-3d63-4c',
    name: 'Compact Refrigerator',
    category: 'Appliances',
    price: 249.99,
    description: 'Compact refrigerator for storing food and beverages.',
    brand: 'CoolTech',
    color: 'Stainless Steel',
    capacity: '3.2 cubic feet',
    temperatureControl: 'Adjustable thermostat',
    availability: 'In stock',
    rating: 4.3
  },
  {
    id: 'e2752a68-9b7a-4b',
    name: 'Wireless Router',
    category: 'Electronics',
    price: 79.99,
    description: 'High-speed wireless router for seamless internet connectivity.',
    brand: 'NetConnect',
    wifiStandard: 'Wi-Fi 6',
    speed: 'Up to 3000 Mbps',
    security: 'WPA3 encryption',
    antennas: '4 external antennas',
    availability: 'In stock',
    rating: 4.4
  },
  {
    id: 'j4876b9f-1d7e-4c',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    description: 'Feature-rich smartwatch for health and fitness tracking.',
    brand: 'FitTech',
    display: '1.3 inches AMOLED',
    sensors: ['Heart rate', 'Blood oxygen'],
    waterResistance: 'Up to 50 meters',
    batteryLife: 'Up to 7 days',
    availability: 'In stock',
    rating: 4.6
  },
  {
    id: '33dab6dc-e01d-4d',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 59.99,
    description: 'Portable Bluetooth speaker for high-quality audio on-the-go.',
    brand: 'SoundWave',
    outputPower: '20W',
    connectivity: 'Bluetooth 5.0',
    batteryLife: 'Up to 10 hours',
    availability: 'Out of stock',
    rating: 4.0
  },
  {
    id: 'f5423b89-6e8c-4e',
    name: 'Digital Camera',
    category: 'Electronics',
    price: 799.99,
    description: 'Professional-grade digital camera for stunning photography.',
    brand: 'PhotoTech',
    sensorType: 'Full-frame CMOS',
    resolution: '24.2 megapixels',
    lensMount: 'Canon EF',
    imageStabilization: true,
    availability: 'In stock',
    rating: 4.8
  },
  {
    id: 'a5891f67-18ec-4e',
    name: 'External Hard Drive',
    category: 'Electronics',
    price: 129.99,
    description: 'High-capacity external hard drive for data backup and storage.',
    brand: 'DataSafe',
    color: 'Silver',
    capacity: '4TB',
    interface: 'USB 3.2 Gen 1',
    availability: 'In stock',
    rating: 4.4
  },
]

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    // Basic validation
    if (!name || !price || isNaN(price)) {
      return res.status(400).json({ error: 'Invalid data provided for product creation' });
    }

    const productId = uuidv4().substring(0, 15);
    // Create the product
    const product = {
      id: productId,
      name,
      price,
      description,
      createdAt: new Date()
    };

    // Send the product creation event to Kafka
    const topic = 'ProductCreated';
    console.log(`Product created: ${product.name}`);
    const result = await produceProductMessage(topic, product);

    res.status(201).json({ success: true, data: product, kafkaResult: result });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    // Fetch products from database or other storage
     // Assuming products are fetched from some data source

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Error getting products' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    // Find the product in the array based on the ID
    const product = products.find(product => product.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ error: 'Error getting product by ID' });
  }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description } = req.body;
    // Basic validation
    if (!name || !price || isNaN(price)) {
      return res.status(400).json({ error: 'Invalid data provided for product update' });
    }
    const product = products.find(product => product.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Send the product update event to Kafka
    const topic = 'ProductUpdated';
    console.log(`Product updated: ${productId}`);
    const result = await produceProductMessage(topic, { id: productId, name, price, description });

    res.json({ success: true, message: 'Product updated successfully', kafkaResult: result });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = products.find(product => product.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
 
    // Send the product deletion event to Kafka
    const topic = 'ProductDeleted';
    console.log(`Product deleted: ${productId}`);
    const result = await produceProductMessage(topic, { id: productId });

    res.json({ success: true, message: 'Product deleted successfully', kafkaResult: result });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};
