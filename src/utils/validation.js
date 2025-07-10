const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (firstName.length < 4 || lastName.length > 50) {
    throw new Error("firstName should be 4-50 Charaters!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not valid!");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validatePasswordData = (req) => {
  const allowedEditPassword = ["password"];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditPassword.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
  validatePasswordData
};
