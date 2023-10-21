import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5); //5 is consider a 'salt', which is like an ingredient that makes the hash more secure..the higher the number, the more secure the hash is...it makes it exponentially harder for a machine to run operations to guess your password.
};

export const createJWT = (user) => {
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization; //Bearer = a generic way of describing that someone can send up some sort of token (access token, an api key, etc)...we do this by just putting the word 'Bearer' in front of the token.

  if (!bearer) {
    res.status(401);
    res.json({ message: 'Not authorized.' });
    return;
  }

  const token = bearer.split(' ')[1]; //split the word 'Bearer' off of the token
  if (!token) {
    res.status(401);
    res.json({ message: 'Not valid token.' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
    res.json({ message: 'Not valid token.' });
    return;
  }
};
