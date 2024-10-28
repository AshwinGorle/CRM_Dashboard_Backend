import {Router} from 'express'
import UserController from '../../controllers/Authentication/userController.js';
import uploadSteam from '../../utils/memoryStorage.utils.js';
const userRouter = Router();

userRouter.get('/',UserController.getAllUser);
userRouter.get('/:id',UserController.getUser);
userRouter.post('/', uploadSteam.single('avatar') ,UserController.createUser);
userRouter.put('/:id', uploadSteam.single('avatar') ,UserController.updateUser);
userRouter.delete('/',UserController.deleteUser);

export default userRouter;