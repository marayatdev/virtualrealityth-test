// import { Router } from "express";
// import { AuthController } from "@/controllers/auth.controller";
// import { authMiddleware } from "@/middlewares/authMiddleware";
// import { UserController } from "@/controllers/user.controller";

// export class AuthRoutes {
//   public router: Router = Router();
//   public userController = new UserController();

//   constructor() {
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     this.router.get("/:id", authMiddleware, this.userController.readUserById);
//     this.router.get("/", authMiddleware, this.userController.listUsers);
//     this.router.post(
//       "/check-password/:id",
//       authMiddleware,
//       this.userController.checkCurrentPassword
//     );
//     this.router.put("/:id", authMiddleware, this.userController.updateUserById);
//     this.router.delete(
//       "/:id",
//       authMiddleware,
//       this.userController.deleteUserById
//     );
//   }
// }

// export default new AuthRoutes().router;
