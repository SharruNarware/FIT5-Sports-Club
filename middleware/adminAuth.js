const adminAuth = (req, res, next) => {

    // Check whether an admin is logged in
    if (!req.session.adminId) {
        return res.redirect("/admin/login");
    }

    // Admin is authenticated
    next();
};

module.exports = adminAuth;