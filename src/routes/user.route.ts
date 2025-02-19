import express from "express";

import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyUser";

const router = express.Router();

router.put("/:userId", verifyToken, updateUser);
router.delete(
  "/:userId",

  verifyToken,
  deleteUser
);
router.get("/", verifyToken, getUsers);
router.get("/:userId", getUser);
router.post("/signout", signout);

export default router;
