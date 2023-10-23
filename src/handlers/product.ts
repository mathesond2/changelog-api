import prisma from '../db';
import { asyncErrorHandler } from '../modules/errors';

export const getProducts = asyncErrorHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      products: true,
    },
  });

  res.json({ data: user.products }); //use this shape consistently for all responses
});

export const getProduct = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const product = await prisma.product.findFirst({
    where: {
      id,
      belongsTo: {
        id: req.user.id,
      },
    },
  });

  res.json({ data: product });
});

export const createProduct = asyncErrorHandler(async (req, res) => {
  const product = await prisma.product.create({
    data: {
      name: req.body.name,
      belongsToId: req.user.id,
    },
  });

  res.json({ data: product });
});

export const updateProduct = asyncErrorHandler(async (req, res) => {
  const updated = await prisma.product.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
    },
  });

  res.json({ data: updated }); //once the client makes the request to update something, be nice and send them the updated version so they dont have to query again.
});

export const deleteProduct = asyncErrorHandler(async (req, res) => {
  const deleted = await prisma.product.delete({
    where: {
      id: req.params.id,
      belongsToId: req.user.id,
    },
  });

  res.json({ data: deleted });
});
