import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken,);
router.get("/:userId/posts", verifyToken,getFeedPosts);
router.get("/:userId/Myposts", verifyToken,getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/updateProfile", verifyToken, likePost);

export default router;
