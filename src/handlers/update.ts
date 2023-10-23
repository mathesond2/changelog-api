import prisma from '../db';
import { asyncErrorHandler } from '../modules/errors';

export const getOneUpdate = asyncErrorHandler(async (req, res) => {
  const update = await prisma.update.findFirst({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: update });
});

export const getUpdates = asyncErrorHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  res.json({ data: updates }); //use this shape consistently for all responses
});

export const createUpdate = asyncErrorHandler(async (req, res, next) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    next({ message: 'product not found' });
    return;
  }

  const update = await prisma.update.create({
    data: req.body,
  });

  res.json({ data: update });
});

export const updateUpdate = asyncErrorHandler(async (req, res, next) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    next({ message: `no update found for ${req.params.id}` });
    return;
  }

  const updated = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updated });
});

export const deleteUpdate = asyncErrorHandler(async (req, res, next) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    next({ message: `no update found for ${req.params.id}` });
    return;
  }

  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deleted });
});
