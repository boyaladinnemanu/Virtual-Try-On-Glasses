const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = 'mongodb+srv://manoj:manoj@cluster0.dhubaol.mongodb.net/vr_glasses?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Item Schema and Model
const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  isAvailable: Boolean
}, { collection: 'glasses' });

const Item = mongoose.model('glasses', itemSchema);

// Order Schema and Model
// const orderSchema = new mongoose.Schema({
//   customerDetails: {
//     name: String,
//     phone: String,
//     address: String,
//     pincode: String,
//   },
//   cartItems: [{
//     _id: String,
//     name: String,
//     price: Number,
//     imageUrl: String,
//     quantity: Number
//   }],
//   paymentMethod: String,
//   createdAt: { type: Date, default: Date.now }
// }, { collection: 'glassesOrders' });




const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // Alternatively, you can use `mongoose.Schema.Types.ObjectId` if referencing a MongoDB ObjectID
    required: true, // Ensures that every order is linked to a user
  },
  customerDetails: {
    name: String,
    phone: String,
    address: String,
    pincode: String,
  },
  cartItems: [{
    _id: String,
    name: String,
    price: Number,
    imageUrl: String,
    quantity: Number
  }],
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'glassesOrders' });



const Order = mongoose.model('glassesOrders', orderSchema);

// User Schema and Model
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// }, { collection: 'userdetails' });
 
const RegisterusersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmpassword: { type: String, required: true }
}, { collection: "Registerusers" });
// const User = mongoose.model('userdetails', userSchema);
const Registerusers = mongoose.model("Registerusers", RegisterusersSchema);
// Register a new user
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }
//     const newUser = new User({ username, password });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// });

app.post("/registration-form",async (req,res)=>{
  try{
          const {username,email,password,confirmpassword}= req.body;
          let exist = await Registerusers.findOne({email});
          if(exist){
              return res.status(400).send("User Already Exist")
          }
          if(password !== confirmpassword){
              return res.status(400).send("Passwords are not matching!");
          }
          let newData = new Registerusers({
              username:username,
              email:email,
              password:password,
              confirmpassword:confirmpassword
          });

          await newData.save();
          res.status(200).send("Register Successfully!");
  }catch(e){
      console.log(e);
      return res.status(500).send("Internal server error")
  }
})


// Login a user
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username, password });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }
//     res.status(200).json({ message: 'Login successful', username: user.username });
//   } catch (error) {
//     console.error('Error logging in user:', error);
//     res.status(500).json({ message: 'Error logging in user', error: error.message });
//   }
// });

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let exist = await Registerusers.findOne({ email });
    if (!exist) {
      return res.send("User Not Exist");
    }
    if (exist.password !== password) {
      return res.status(400).send("Invalid Password");
    }
    let payload = {
      user: {
        id: exist.id,
      },
    };
    jwt.sign(payload, "jwtSecret", { expiresIn: 3600000 }, (err, token) => {
      if (err) throw err;
      // Include user ID in the response
      return res.json({ token, userId: exist.id });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});


// Get all items
app.get('/getItem', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

//get items
// app.get('/orders', async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// });



app.get('/orders', async (req, res) => {
  try {
    const userId = req.query.userId; // Extract user ID from query parameters
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch orders for the given user ID
    const orders = await Order.find({  userId}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get a specific item by ID
app.get('/getItem/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item details', error });
  }
});

// Place an order
// Place an order
// app.post('/orders', async (req, res) => {
//   const { customerDetails, cartItems, paymentMethod } = req.body;

//   // Check if required fields are provided
//   if (!customerDetails || !cartItems || !paymentMethod) {
//     return res.status(400).json({ message: 'Missing required fields in order' });
//   }

//   // Validate cart items
//   if (!Array.isArray(cartItems) || cartItems.length === 0) {
//     return res.status(400).json({ message: 'Cart items cannot be empty' });
//   }

//   try {
//     // Create new order
//     const newOrder = new Order({
//       customerDetails,
//       cartItems,
//       paymentMethod,
//     });
    
//     // Save the order to database
//     await newOrder.save();
    
//     // Respond with success
//     res.status(201).json({ message: 'Order placed successfully' });
//   } catch (error) {
//     // Log the error details to help debugging
//     console.error('Error placing order:', error);
//     res.status(500).json({ message: 'Error placing order', error: error.message });
//   }
// });


app.post('/orders', async (req, res) => {
  try {
    const { userId, customerDetails, cartItems, paymentMethod } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const newOrder = new Order({
      userId,
      customerDetails,
      cartItems,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});


const port = 3003
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
