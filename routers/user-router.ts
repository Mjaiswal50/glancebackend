import {Router} from "express";
import {UserController} from "../controller/user-controller";
import { auth } from "../middleware/middlewares";

class UserRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/signup', UserController.signUp);
        this.router.get('/login',UserController.login);
		this.router.patch('/verify',auth,UserController.setVerified);
		this.router.get('/fetch', auth, UserController.getUserDetails);
		this.router.patch('/fpreset',UserController.fpReset);
		this.router.patch('/fpset', UserController.fpSet);
}
}

export default new UserRouter().router;
