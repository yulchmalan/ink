import express from "express";
const router = express.Router();

router.get("/auth", (req, res) => {
  res.send("auth page");
});

export default router;
