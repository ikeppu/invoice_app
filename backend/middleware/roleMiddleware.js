import { ADMIN, USER } from "../constants/index.js";

const ROLES = {
  User: USER,
  Admin: ADMIN,
};

const checkRole = (...alowedRoles) => {
  return (req, res, next) => {
    if (!req?.user && !req?.roles) {
      res.status(401);
      throw new Error("You are not authrorized to use our platform");
    }

    const rolesArray = [...alowedRoles];

    const roleFound = req.roles
      .map((role) => rolesArray.includes(role))
      .find((value) => value === true);

    if (!roleFound) {
      res.status(401);
      throw new Error("You are not authrorized to perform this request");
    }
    next();
  };
};

const role = { ROLES, checkRole };

export default role;
