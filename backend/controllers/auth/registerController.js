import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const domainUrl = process.env.DOMAIN;
const { randomBytes } = await import("crypto");

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, username, firstName, lastName, password, passwordConfirm } =
    req.body;

  if (!email) {
    res.status(400);
    throw new Error("An email address is required");
  }

  if (!username) {
    res.status(400);
    throw new Error("A username is required");
  }

  if (!firstName || !lastName) {
    res.status(400);
    throw new Error("You must enter full name with a first and last name");
  }

  if (!password) {
    res.status(400);
    throw new Error("You must enter a password");
  }

  if (!passwordConfirm) {
    res.status(400);
    throw new Error("Confirm password field is required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error(
      "The email address you've entered is already associated with another account"
    );
  }

  const newUser = new User({
    email,
    username,
    firstName,
    lastName,
    password,
    passwordConfirm,
  });

  const registeredUser = await newUser.save();

  if (!registeredUser) {
    res.status(400);
    throw new Error("User could not be registered");
  }

  if (registeredUser) {
    const verificationToken = randomBytes(32).toString("hex");

    let emailVerificationToken = await new VerificationToken({
      _userId: registeredUser._id,
      token: verificationToken,
    }).save();

    const emailLink = `${domainUrl}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;

    const payload = {
      name: registeredUser.firstName,
      link: emailLink,
    };

    await sendEmail(
      registeredUser.email,
      "Account Verification",
      payload,
      "./emails/template/accountVerification.handlebars"
    );

    res.json({
      success: true,
      message: `A new user ${registeredUser.firstName} has been registered!
      A verification email has been sent to your account. Please verify within 15 minutes`,
    });
  }
});

export default registerUser;
