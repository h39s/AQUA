import './styles/Button.scss';

interface IButtonProps {
  children: JSX.Element;
  ariaLabel: string;
  isDisabled: boolean;
  className?: string;
  handleChange: () => void;
}

const Button = ({
  children,
  ariaLabel,
  isDisabled,
  className = 'button',
  handleChange,
}: IButtonProps) => {
  return (
    <div
      role="button"
      aria-label={ariaLabel}
      className={className}
      onMouseUp={handleChange}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {children}
    </div>
  );
};

export default Button;
