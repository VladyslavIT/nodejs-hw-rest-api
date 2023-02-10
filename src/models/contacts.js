const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const { v4 } = require("uuid");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await listContacts();
    const oneContact = data.find((item) => item.id.toString() === contactId);
    if (!oneContact) {
      return null;
    }
    return oneContact;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await listContacts();
    const index = data.findIndex((item) => item.id.toString() === contactId);
    if (index === -1) {
      return null;
    }
    const result = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, " "));
    return result;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const newContact = {
      id: v4(),
      name,
      email,
      phone,
    };
    const data = await listContacts();
    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, " "));
    return newContact;
  } catch (error) {
    console.error(error);
  }
};

const updateContact = async (id, body) => {
  try {
    const data = await listContacts();
    const index = data.findIndex((item) => id === item.id.toString());
    if (index === -1) {
      return null;
    }
    data[index] = { id, ...body };
    await fs.writeFile(contactsPath, JSON.stringify(data, null, " "));
    return data[index];
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
