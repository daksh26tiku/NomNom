   const mongoose = require('mongoose');
   
   mongoose.connect('mongodb://localhost:27017/nomnom').then(async () => {
     try {
       const User = require('./src/models/UserModel');
       const users = await User.find({});
       console.log('Total users in database:', users.length);
       users.forEach(user => console.log('User:', {email: user.email, fullName: user.fullName, id: user._id}));
       process.exit(0);
     } catch(err) {
       console.error('Error:', err);
       process.exit(1);
     }
   });