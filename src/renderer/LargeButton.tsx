import './styles/LargeButton.scss';

interface ILargeButtonProps {
  children: JSX.Element;
  ariaLabel: string;
  isDisabled: boolean;
  handleChange: () => void;
}

const LargeButton = ({
  children,
  ariaLabel,
  isDisabled,
  handleChange,
}: ILargeButtonProps) => {
  return (
    <div
      role="button"
      aria-label={ariaLabel}
      className="button"
      onMouseUp={handleChange}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {children}
    </div>
  );
};

export default LargeButton;
