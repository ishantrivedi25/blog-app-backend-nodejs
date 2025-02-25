import express from "express";

import { google, signin, signup } from "../controllers/auth.controller";
import { validateData } from "../middlewares/validateData";
import {
  signupSchema,
  signinSchema,
  googleAuthSchema,
} from "../schemas/authSchemas";

const router = express.Router();

router.post("/signin", validateData(signinSchema), signin);
router.post("/signup", validateData(signupSchema), signup);
router.post("/google", validateData(googleAuthSchema), google);

export default router;
