// Same options for every place the auth cookie is set or cleared.
// `secure` only in production so the cookie still works on http://localhost.
const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
});

module.exports = { getCookieOptions };
