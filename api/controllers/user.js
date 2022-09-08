const User = require('../models/user');

const signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const finduser = await User.findOne({email}).exec();
    if (finduser) {
      throw new Error('User already Exist');
    }
    const user = new User({
      name,
      email,
      password
    });

    //Generate token
    const token = await user.generateTokens();
    if (!token){
      throw new Error('Sorry, Having some Issues Logging in.....');
    }
    const save = await user.save();
    res.json({token,data:save,error:false,statusText:'User Created Successfully'});

  } catch(e){
    return res.send({"errorMsg":e.message,errorStatus:500,error:true});
  }

}

const login = async (req,res)=> {
  try {
  const allowedField = ['email','password'];
  const body = req.body;
  const keys = Object.keys(body);
  const isKey = keys.filter(key=>!allowedField.includes(key));

  const theAffectedKey = isKey[0];

  if ( isKey.length > 0 ) {
      throw new Error(`${theAffectedKey } is not valid, below are the list of Accepted Fields '${allowedField}' `);
  }

  //Declaring Variable
  const email = req.body.email;
  const password = req.body.password;

  //Check if User is in the Database
  const isUser = await User.checkCredentials(email,password);
  if (!isUser){
    throw new Error('Invalid login credentials');
  }

  //Generate token
  const token = await isUser.generateTokens();
  if (!token){
    throw new Error('Sorry, We are having Issues Logging you in');
  }

  return res.status(200).json({
    message: 'Auth Succesful',
    token: token
  });

  } catch(e) {
    return res.send({"errorMsg":e.message,errorStatus:500,error:true});
  }
  
}

const delete_user = async (req, res, next) => {
  const user = await User.findById(req.id);
  const result = await user.remove(); //remove user
  res.status(200).json({
    message: 'User Deleted',
    result
  });
}

module.exports = {signup,login,delete_user} ;