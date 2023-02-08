const sendGrid = require("@sendgrid/mail");

const { SENDGRID_KEY, EMAIL } = process.env;

const sendEmail = async (credentials) => {
  try {
    sendGrid.setApiKey(SENDGRID_KEY);
    const email = {
      from: EMAIL,
      ...credentials,
    };
    await sendGrid.send(email);
  } catch (error) {
    console.error("Error API");
  }
};

module.exports = sendEmail;
