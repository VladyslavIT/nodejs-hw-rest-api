const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname, 'contacts.json');

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
    const oneContact = data.find((item) => item.id === contactId);
    if(!oneContact) {
      return null;
    }
    return oneContact;
  } catch (error) {
    console.error(error);
  }
}

const removeContact = async (contactId) => {
  try {
    const data = await listContacts();
    const result = data.filter(item => contactId !== item.id);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, ' '));
    return result;
  } catch (error) {
    console.error(error);
  }
}

const addContact = async (name, email, phone) => {
 try {
  const newContact = { id: Date.now.toString(), name, email, phone };
  const data = await listContacts();
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, ' '));
  return newContact;
}
 catch (error) {
  console.error(error);
 } 
}

const updateContact = async (contactId, body) => {
  try {
    const data = await listContacts();
    const index = data.findIndex(item => contactId === item.id);
    if(index === -1) {
      return null;
    }
    data[index] = {contactId, ...body};
    await fs.writeFile(contactsPath, JSON.stringify(data));
    return data[index];
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
