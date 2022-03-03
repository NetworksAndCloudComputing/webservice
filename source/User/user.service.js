const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('./../db/db');

async function createUser(user) {
  await db.initialize();
  const userDetails = await db.User.findOne({ where: { username: user.username } })
  if (userDetails) {
    throw user.username + " already exists";
    return;
  }
  if (user.password) {
    user.hash = await bcrypt.hash(user.password, 10);
  }
  user.id = uuid.v4();
  let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  user.created_time = date_ob;
  user.updated_time = date_ob;
  user.password = user.hash;
  await db.User.create(user);
  const det = await db.User.findOne({ where: { username: user.username } })
  let {id,username,first_name,last_name,created_time,updated_time}=det;
  return {id,username,first_name,last_name,created_time,updated_time};
}

async function updateUser(data,user){
  console.log('inside update user')
  let userDetails = await db.User.findOne({ where: { username: user.name } })
  if (!userDetails) {
    throw user.username + " doesn't exists";
    return;
  }
  userDetails = userDetails.dataValues
  if (data.password) {
    userDetails.password = await bcrypt.hash(data.password, 10);
  }
  if(data.created_time){
    delete user.created_time;
  }

  if(data.updated_time){
    delete user.updated_time;
  }
  if(data.first_name){
    userDetails.first_name = data.first_name
  }
  if(data.last_name){
    userDetails.last_name = data.last_name
  }
  let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  userDetails.updated_time = date_ob
  db.User.update({password:userDetails.password,
                  first_name:userDetails.first_name,
                  last_name:userDetails.last_name,
                  updated_time:userDetails.updated_time
                  },{where:{username:user.name}})

}
  
async function getUserDetails({username}){
  const data = await db.User.findOne({ where: { username: username } });
  const {id,first_name,last_name,created_time,updated_time} = data.dataValues;
  console.log({id,username,first_name,last_name,created_time,updated_time});
  return {id,username,first_name,last_name,created_time,updated_time}

}

async function getUserWithHash({username}){
  return await db.User.findOne({ where: { username: username } });
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
module.exports = {
  // authenticate,
  getUserDetails,
  getUserWithHash,
  updateUser,
  createUser
}