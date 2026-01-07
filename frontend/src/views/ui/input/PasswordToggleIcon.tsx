import React from 'react';
import './PasswordToggleIcon.scss';

// Define the props interface
interface PasswordToggleIconProps {
  showPassword: boolean;
  togglePassword: () => void;
  type: string;
}

const VisibleIcon: React.FC = () => <i className="fa-regular fa-eye" />;
const HiddenIcon: React.FC = () => <i className="fa-regular fa-eye-slash" />;

const PasswordToggleIcon: React.FC<PasswordToggleIconProps> = ({ showPassword, togglePassword, type }) => {
  return (
    type === 'password' && (
      <span
        className="toggle-password"
        onClick={togglePassword}
      >
        {showPassword ? <VisibleIcon /> : <HiddenIcon />}
      </span>
    )
  );
};

export default PasswordToggleIcon;