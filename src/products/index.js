import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";
import { validationResult } from "express-validator";
import { productsValidation } from "./validation.js";
import { getProducts, writeProducts } from "../lib/fs-tools.js";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    if (req.query.category) {
      const filteredProducts = products.filter(
        (elem) => elem.category === req.query.category
      );

      if (filteredProducts.length > 0) {
        res.send(filteredProducts);
      } else {
        next(createError(404, `no product found in ${req.query.category}!`));
      }
    } else {
      res.send(products);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const products = await getProducts();
    const product = products.find((elem) => elem._id === req.params.id);
    if (product) {
      res.send(product);
    } else {
      next(
        createError(404, `product with the id of ${req.params._id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await getReviews();

    const productReviews = reviews.filter(
      (elem) => elem.productId === req.params.id
    );

    res.send(productReviews);
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/", productsValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newProduct = {
        ...req.body,
        _id: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const products = await getProducts();
      products.push(newProduct);
      await writeProducts(products);

      res.status(201).send({ _id: newProduct._id });
    } else {
      next(createError(400, { errorList: errors }));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", productsValidation, async (req, res, next) => {
  try {
    const products = await getProducts();
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const remainingProduct = products.filter(
        (elem) => elem._id !== req.params.id
      );
      const oldProduct = products.filter((elem) => elem._id === req.params.id);
      const updatedProduct = {
        ...req.body,
        _id: req.params.id,
        createdAt: oldProduct.createdAt,
        updatedAt: new Date(),
      };

      remainingProduct.push(updatedProduct);
      await writeProducts(remainingProduct);

      res.send(
        `the product with id of ${req.params.id} was updated successfully`
      );
    } else {
      next(createError(400, { errorList: errors }));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const products = await getProducts();
    const remainingProduct = products.filter(
      (elem) => elem._id !== req.params.id
    );
    await writeProducts(remainingProduct);
    res.status(204).send("deleted successfully");
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
