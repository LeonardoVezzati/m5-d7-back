import { body } from "express-validator";

export const productsValidation = [
  body("name").exists().withMessage("Product name is mandatory!"),
  body("price")
    .exists()
    .withMessage("Price is mandatory!")
    .isFloat()
    .withMessage("Price needs to be a float!"),
  body("brand").exists().withMessage("Brand is mandatory!"),
  body("description").exists().withMessage("Description is mandatory!"),
];
