import Router from "express";
import { registrationUser } from "../controllers/user.controller.js";

const router = Router();

router.post('/registration', registrationUser);

export default router;