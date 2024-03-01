const router = require("express").Router();

const Flow = require("../models/Flow");
const verifyUser = require("../utils/verifyUser");

router.post("/create", verifyUser, async (req, res) => {
  try {
    const { userId } = req.reqUser;
    const { flowName, nodes, edges } = req.body;
    if (!flowName || !nodes || !edges)
      throw Error("You need to provide all the fields");
    const newFlow = new Flow({
      owner: userId,
      flowName,
      nodes,
      edges,
    });
    const flow = await newFlow.save();
    if (!flow) throw Error("Something went wrong while saving the flow");
    res.status(200).json({
      success: true,
      flowId: flow._id,
      msg: "Flow created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
});

router.get("/get", verifyUser, async (req, res) => {
  try {
    const flows = await Flow.find({
      owner: req.reqUser.userId,
    });
    if (!flows) throw Error("No flows found");
    res.status(200).json({
      success: true,
      flows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
});

router.put("/edit/:id", verifyUser, async (req, res) => {
  try {
    const { userId } = req.reqUser;
    const flow = await Flow.findById(req.params.id);
    if (!flow) throw Error("No flow found");
    if (flow.owner.toString() === userId) {
      await flow.updateOne({ $set: req.body });
      res.status(200).json({
        success: true,
        msg: "Flow updated",
      });
    } else {
      throw Error("You are not the owner of this flow");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
});

module.exports = router;
