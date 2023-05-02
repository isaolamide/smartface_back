
const express= require('express')
const bodyParser = require('body-parser')
const cors= require ('cors')
const bcrypt= require('bcrypt-nodejs')
const knex= require('knex');
const postg= require('pg');
const register= require('./controlendpoint/register');
const signin= require('./controlendpoint/signin');
const image= require('./controlendpoint/image');
const profile= require('./controlendpoint/profile');
const update= require('./controlendpoint/update')

const db=knex({
    client: 'pg',
    connection: {
      connectionString:process.env.DATABASE_URL,
      ssl: {rejectUnauthorized: false},
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database :process.env.DATABASE_DB
    }
  });
  db.select('*')
  .from('users').then(data=>{
})


const app= express()
app.use(bodyParser.json())
app.use(cors())
app.get('/', (req,res)=>{
    res.send(db.users)
})

app.post('/signin',(req,res)=>{signin.handleSignin(req,res,db,bcrypt)})

app.post('/register', (req,res)=>{register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res)=>{profile.handleProfile(req,res,db)})

app.put('/update/:id', (req,res)=>{update.handleUpdate(req,res,db, bcrypt)})
app.put('/image', (req,res)=>{image.handleImage(req,res,db)})
app.post('/imageUrl',(req,res)=>{image.handleApiCall(req,res)})


app.listen(4000, ()=>{
    console.log("app is running well at port 4000")
})
