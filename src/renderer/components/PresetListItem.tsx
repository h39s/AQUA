import { MouseEvent, useRef, useState } from 'react';
import { formatPresetName, useMouseDownOutside } from 'renderer/utils/utils';
import IconButton, { IconName } from 'renderer/widgets/IconButton';
import TextInput from 'renderer/widgets/TextInput';

interface IPresetListItemProps {
  value: string;
  handleRename: (newValue: string) => void;
  handleDelete: () => void;
  isDisabled: boolean;
  validate: (newValue: string) => string;
}

const PresetListItem = ({
  value,
  handleRename,
  handleDelete,
  isDisabled,
  validate,
}: IPresetListItemProps) => {
  const editValueRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleEditClicked = () => {
    setIsEditMode(true);
  };

  const handleDeleteClicked = (e?: MouseEvent) => {
    // Prevent list item from receiving the click event when the delete icon is clicked
    e?.stopPropagation();
    handleDelete();
  };

  const handleEscape = () => {
    setIsEditMode(false);
    setErrorMessage('');
  };

  const handleInputChange = (newValue: string) => {
    const msg = validate(newValue);
    setErrorMessage(msg);

    if (!msg) {
      // Rename preset if validation passes
      handleRename(newValue);
      setIsEditMode(false);
    }
  };

  // Close edit mode if the user clicks outside of the input
  useMouseDownOutside<HTMLInputElement>(editValueRef, handleEscape);

  return (
    <>
      {isEditMode ? (
        <TextInput
          ref={editValueRef}
          value={value}
          ariaLabel="Edit Preset Name"
          isDisabled={false}
          errorMessage={errorMessage}
          handleSubmit={handleInputChange}
          handleEscape={handleEscape}
          formatInput={formatPresetName}
        />
      ) : (
        <>
          {value}
          <div className="row icons">
            <IconButton
              icon={IconName.EDIT}
              handleClick={handleEditClicked}
              isDisabled={isDisabled}
            />
            <IconButton
              icon={IconName.DELETE}
              handleClick={handleDeleteClicked}
              isDisabled={isDisabled}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PresetListItem;
