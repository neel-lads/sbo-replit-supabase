import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import dealersRouter from "./dealers";
import contentRouter from "./content";
import submissionsRouter from "./submissions";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/dealers", dealersRouter);
router.use("/content", contentRouter);
router.use("/submissions", submissionsRouter);
router.use("/admin", adminRouter);

export default router;
