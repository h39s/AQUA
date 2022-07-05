import './styles/Button.scss';

interface IButtonProps {
  children: JSX.Element | string;
  ariaLabel: string;
  isDisabled: boolean;
  className?: string;
  handleChange: () => void;
}

const Button = ({
  children,
  ariaLabel,
  isDisabled,
  className = '',
  handleChange,
}: IButtonProps) => {
  return (
    <div
      role="button"
      aria-label={ariaLabel}
      className={`button ${className}`}
      onMouseUp={handleChange}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {children}
    </div>
  );
};

export default Button;
