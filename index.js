const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware

const corsOptions = {
      origin: "*",
      credentials: true,
      optionSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
    app.use(express.json());




 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfbgofj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

    const collegesCollections = client.db('collegeBookr').collection('colleges');
    const researchCollections = client.db('collegeBookr').collection('research');
    const feedbackCollections = client.db('collegeBookr').collection('feedback');
    const studentsCollections = client.db('collegeBookr').collection('studentsInformation');


app.get('/colleges', async(req, res)=>{
  const result = await collegesCollections.find().toArray();
  res.send(result)
})


// search option created

app.get("/colleges/:text", async (req, res) => {
  const searchText = req.params.text;
  const result = await collegesCollections
    .find({
      $or: [
        { collegeName: { $regex: searchText, $options: "i" } },
       
      ],
    })
    
    .toArray();
  res.send(result);
});


app.get('/research', async(req, res)=>{
  const result = await researchCollections.find().toArray()
  res.send(result)
})

app.get('/feedback', async(req, res)=>{
  const result = await feedbackCollections.find().toArray()
  res.send(result)
})



app.get("/college/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await collegesCollections.findOne(query);
  res.send(result);
});


app.post('/admission', async(req, res)=>{
  const body = req.body 
  const result = await studentsCollections.insertOne(body)
  res.send(result)
})

app.get('/booked/:email',async(req, res)=>{
  const email = req.params.email 
  const query = {email:email} 
  const result = await studentsCollections.find(query).toArray() 
  res.send(result)
})


app.get('/students/:id',async(req, res)=>{
  const id = req.params.id 
  const query ={ _id: new ObjectId(id)} 
  const result = await studentsCollections.findOne(query) 
  res.send(result)
})

// for feedback

app.put("/feedback/:id",async(req, res) => {
  const id = req.params.id;
  const user = req.body;
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await feedbackCollections.updateOne(
    query,
    updateDoc,
    options
  );
  res.send(result);
});





    
app.put('/users/:email',async(req, res)=>{
      const email =req.params.email
      const user =req.body
      const query ={email: email}
      const options ={upsert: true}
      const updateDoc={
            $set: user,
      }

      // const result = await userCollection.updateOne(query, updateDoc, options)
     const result = await usersCollections.updateOne(query, updateDoc, options)
      console.log(result);
      res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);





    app.get('/', (req, res)=>{
      res.send('College Bookr is running')
    })

    app.listen(port,()=>{
      console.log(`College Bookr is running on port ${port}`);
    })

