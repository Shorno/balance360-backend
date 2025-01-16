import {Router} from "express";
import {createOrUpdateUser, getRoleByEmail} from "../controllers/userController.js";

const router = Router();

router.post('/', createOrUpdateUser);
router.get("/", (req, res) => {
    res.send("Hello from user routes");
});
router.get("/role/:email", getRoleByEmail)


export default router;