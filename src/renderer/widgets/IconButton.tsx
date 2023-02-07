import { KeyboardEvent, MouseEvent, useMemo } from 'react';
import DeleteIcon from 'renderer/icons/DeleteIcon';
import EditIcon from 'renderer/icons/EditIcon';
import TrashIcon from 'renderer/icons/TrashIcon';

export enum IconName {
  EDIT = 'Edit Icon',
  DELETE = 'Delete Icon',
  TRASH = 'Trash Icon',
}

interface IIconButtonProps {
  icon: IconName;
  isDisabled: boolean;
  className?: string;
  handleClick: (e?: MouseEvent) => void;
}

const IconButton = ({
  icon,
  isDisabled,
  className,
  handleClick,
}: IIconButtonProps) => {
  // Helper for detecting use of the ENTER key
  const onKeyUp = (e: KeyboardEvent) => {
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
      case IconName.TRASH:
        return <TrashIcon />;
      default:
        return null;
    }
  }, [icon]);

  return (
    <div
      role="button"
      aria-label={icon}
      className={`iconButton center ${className}`}
      onKeyUp={onKeyUp}
      onClick={handleClick}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {getIcon}
    </div>
  );
};

export default IconButton;
