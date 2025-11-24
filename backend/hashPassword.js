import bcrypt from "bcryptjs";

const hashPassword = "Alfathir123";
const saltrounds = 10;

bcrypt.hash(hashPassword, saltrounds).then((hash) => {
  console.log("Hashed Password:", hash);
});
