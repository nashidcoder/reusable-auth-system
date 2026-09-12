// Email validation ke liye regex.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password ke liye minimum 8 characters,
// kam az kam ek letter aur ek number.
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// Email validate karne wala function.
export function isValidEmail(email) {
  return (
    typeof email === "string" &&
    emailRegex.test(email.trim().toLowerCase())
  );
}

// Password validate karne wala function.
export function isValidPassword(password) {
  if (typeof password !== "string") {
    return false;
  }

  const cleanPassword = password.trim();

  return passwordRegex.test(cleanPassword);
}

// Name validate karne wala function.
export function isValidName(name) {
  return typeof name === "string" && name.trim().length >= 2;
}

// Registration validation.
export function validateRegister(data) {
  const { name, email, password } = data;

  if (!isValidName(name)) {
    return "Name must be at least 2 characters.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email.";
  }

  if (!isValidPassword(password)) {
    return "Password must be at least 8 characters and contain a letter and a number.";
  }

  return null;
}

// Login validation.
export function validateLogin(data) {
  const { email, password } = data;

  if (!isValidEmail(email)) {
    return "Please enter a valid email.";
  }

  if (typeof password !== "string" || password.length === 0) {
    return "Password is required.";
  }

  return null;
}

// Forgot password validation.
export function validateForgotPassword(data) {
  const { email } = data;

  if (!isValidEmail(email)) {
    return "Please enter a valid email.";
  }

  return null;
}

// Reset password validation.
export function validateResetPassword(data) {
  const { password } = data;

  if (!isValidPassword(password)) {
    return "Password must be at least 8 characters and contain a letter and a number.";
  }

  return null;
}

// Resend verification email validation.
export function validateResendVerification(data) {
  const { email } = data;

  if (!isValidEmail(email)) {
    return "Please enter a valid email.";
  }

  return null;
}