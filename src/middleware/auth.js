const adminAuth = (req, res, next) => {
  const token = "lkgfgfaVNMVMN12";
  const isAuthenticated = token === "lkgfgfaVNMVMN12";
  if (!isAuthenticated) {
    res.status(401).send("Unauthrised token!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "lkgfgfaVNMVMN12";
  const isAuthenticated = token === "lkgfgfaVNMVMN12";
  if (!isAuthenticated) {
    res.status(401).send("Unauthrised token!");
  } else {
    next();
  }
};

module.exports = {adminAuth, userAuth}