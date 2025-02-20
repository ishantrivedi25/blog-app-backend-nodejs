import express from "express";

import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyUser";
import { validateData } from "../middlewares/validateData";
import {
  updateUserSchema,
  deleteUserSchema,
  getUsersSchema,
  getUserSchema,
} from "../schemas/userSchemas";

const router = express.Router();

router.put("/:userId", validateData(updateUserSchema), verifyToken, updateUser);
router.delete(
  "/:userId",
  validateData(deleteUserSchema),
  verifyToken,
  deleteUser
);
router.get("/", validateData(getUsersSchema), verifyToken, getUsers);
router.get("/:userId", validateData(getUserSchema), getUser);
router.post("/signout", signout);

export default router;
