import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import projectsRouter from "./projects.js";
import dashboardRouter from "./dashboard.js";
import authRouter from "./auth.js";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(projectsRouter);
router.use(dashboardRouter);

export default router;
