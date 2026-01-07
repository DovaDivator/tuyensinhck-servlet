import { useState } from 'react';

const usePasswordToggle = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  return { showPassword, togglePassword };
};

export default usePasswordToggle;
