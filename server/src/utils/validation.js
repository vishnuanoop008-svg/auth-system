export function validateUsername(username) {
  if (!username.trim()) {
    return "Username is required";
  }

  if (username.length < 3 || username.length > 20) {
    return "Username must be 3-20 characters";
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Use letters, numbers or underscores only";
  }

  return "";
}

export function validateEmail(email) {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  return "";
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
}

export function validateFullName(fullName) {
  if (!fullName.trim()) {
    return "Full name is required";
  }

  if (fullName.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }

  return "";
}