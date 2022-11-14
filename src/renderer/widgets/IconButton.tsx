import { KeyboardEvent, useMemo } from 'react';
import DeleteIcon from 'renderer/icons/DeleteIcon';
import EditIcon from 'renderer/icons/EditIcon';
// import '../styles/IconButton.scss';

export enum IconName {
  EDIT = 'Edit Icon',
  DELETE = 'Delete Icon',
}

interface IIconButtonProps {
  icon: IconName;
  isDisabled: boolean;
  handleClick: () => void;
}

const IconButton = ({ icon, isDisabled, handleClick }: IIconButtonProps) => {
  // Helper for detecting use of the ENTER key
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleClick();
    }
  };

  const getIcon = useMemo(() => {
    switch (icon) {
      case IconName.EDIT:
        return <EditIcon />;
      case IconName.DELETE:
        return <DeleteIcon />;
      default:
        return null;
    }
  }, [icon]);

  return (
    <div
      role="button"
      aria-label={icon}
      className="iconButton center"
      onKeyDown={onKeyDown}
      onClick={handleClick}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {getIcon}
    </div>
  );
};

export default IconButton;
