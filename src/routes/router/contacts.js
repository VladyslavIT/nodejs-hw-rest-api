const express = require("express");
const router = express.Router();
const {
  getContacts,
  getById,
  deleteContact,
  postContact,
  putContact,
  patchContact,
} = require("../api/controller");
const { validateSchema } = require("../../middlewares/validateSchema");
const { addSchema } = require("../../middlewares/addContactSchema");

router.get("/", getContacts);
router.get("/:contactId", getById);
router.post("/", validateSchema(addSchema), postContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", putContact);
router.patch("/:contactId/favorite", patchContact);

module.exports = router;
