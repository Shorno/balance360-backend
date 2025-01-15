import {Router} from "express";
import {createOrUpdateUser} from "../controllers/userController.js";

const router = Router();

router.post('/', createOrUpdateUser);


export default router;