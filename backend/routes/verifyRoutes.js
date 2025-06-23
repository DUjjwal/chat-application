import { Router } from "express";
import { roomVerify, userVerify } from "../controllers/verifyController.js";

const router = Router()


router.route('/user').post(userVerify)
router.route('/room').post(roomVerify)

export default router