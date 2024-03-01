const router = require("express").Router();

const Flow = require("../models/Flow");
const verifyUser = require("../utils/verifyUser");

router.post("/create", verifyUser, async (req, res) => {
  try {
    const { userId } = req.reqUser;
    const { name, nodes, edges } = req.body;
    const newFlow = new Flow({
      owner: userId,
      name,
      nodes,
      edges,
    });
    const flow = await newFlow.save();
    res.status(200).json(flow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/get", verifyUser, async (req, res) => {
  try {
    const flows = await Flow.find({
      owner: req.reqUser.userId,
    });
    res.status(200).json(flows);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/edit/:id", verifyUser, async (req, res) => {
  try {
    const { userId } = req.reqUser;
    const flow = await Flow.findById(req.params.id);
    if (flow.owner === userId) {
      await flow.updateOne({ $set: req.body });
      res.status(200).json("the flow has been updated");
    } else {
      res.status(403).json("you can update only your flow");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
