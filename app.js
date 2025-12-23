const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./auth");
const { generateToken } = require("./jwt");
const protectedRoutes = require("./routes/protected");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
  }
);
app.post("/logout", (req, res) => {
  req.logout?.(() => {
    res.json({ message: "Logged out" });
  }) || res.json({ message: "Logged out" });
});

app.use("/api", protectedRoutes);
app.use("/admin", adminRoutes);

app.get("/logout-test", (req, res) => {
  res.json({ message: "Logout works" });
});
app.listen(4000, () => console.log("Server started on 4000"));
