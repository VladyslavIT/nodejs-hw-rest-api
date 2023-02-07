
const sendGrid = require("@sendgrid/mail");

const { SENDGRID_KEY, EMAIL } = process.env;

const sendEmail = async(credentials) => {
  try {
    sendGrid.setApiKey(SENDGRID_KEY);
    const email = {
      from: EMAIL,
      ...credentials
    };
    const response = await sendGrid.send(email);
    console.log("response", response);
  } catch (error) {
    console.error("Error API");
  }
}
module.exports = sendEmail;
