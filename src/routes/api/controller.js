const { Contact } = require("../../models/contact");

const getContacts = async (req, res, next) => {
  try {
    const result = await Contact.find({});
    res.status(200).json({
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await Contact.findById(req.params.contactId);
    console.log(req.params.contactId);
    if (!result) {
      res.status(404).json({
        code: 404,
        message: "Not found",
      });
      return;
    }
    res.status(200).json({
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const postContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const result = await Contact.create(name, email, phone);
    if (!result) {
      res
        .status(400)
        .json({ code: 400, message: "missing required name field" });
      return;
    }
    res.status(201).json({
      code: 201,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const result = await Contact.findByIdAndRemove(req.params.contactId);
    console.log(req.params.contactId);
    if (!result) {
      res.status(404).json({
        code: 404,
        message: "Not Found",
      });
      return;
    }
    res.status(200).json({
      code: 200,
      message: "contact deleted",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const putContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await Contact.findByIdAndUpdate(id, req.body);
    console.log(id);
    if (!result) {
      res.status(404).json({
        code: 404,
        message: "Not found",
      });
      return;
    }
    res.status(200).json({
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const patchContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (!req.body) {
      res.status(400).json({
        code: 400,
        message: "missing field favorite",
      });
      return;
    }
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      res.status(404).json({
        code: 404,
        message: "Not found",
      });
      return;
    }
    res.status(200).json({
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getById,
  deleteContact,
  postContact,
  putContact,
  patchContact,
};
