import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { createNewUser, signIn } from './handlers/user';

const app = express();

//global for the whole app....every api req that hits this server has to go through this
app.use(cors()); //everyone can hit this server at this point
app.use(morgan('dev'));
app.use(express.json()); //this allows a user to send json to the server
app.use(express.urlencoded({ extended: true })); //this allows us to format the url into a json object

app.get('/', (req, res, next) => {
  // setTimeout(() => {
  //   next(new Error('hello'));
  // }, 1000);
  res.status(200);
  res.json({ message: 'Hello World!' });
  res.end();
});

//all subroutes of /api will be protected
app.use('/api', protect, router);

//notice that we are not using the 'protect' middleware here...we don't want to protect the user routes
app.post('/user', createNewUser);
app.post('/signin', signIn);

app.use((err, req, res, next) => {
  // res.json({ message: 'oops there was an error' });
  if (err.type === 'auth') {
    res.status(401).json({ message: 'unauthorized' });
  } else if (err.type === 'input') {
    res.status(400).json({ message: err.message || 'invalid input' });
  } else {
    res.status(500).json({ message: err.message || 'a server error occurred' });
  }
});

export default app;
