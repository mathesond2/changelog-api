import { Prisma } from '@prisma/client';
import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { asyncErrorHandler } from '../modules/errors';

//talking to a disc is async
export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        e.message = 'username already exists';
      }
      e['type'] = 'input';
    }
    console.error(`createNewUser error: ${e.message}`);
    next(e);
  }
};

export const signIn = asyncErrorHandler(async (req, res, next) => {
  const errObj = { message: 'Please enter a valid username and password.', type: 'auth' };
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    next(errObj);
    return;
  }

  const isValid = await comparePasswords(req.body.password, user.password);
  if (!isValid) {
    next(errObj);
    return;
  }

  const token = createJWT(user);
  res.json({ token });
});
