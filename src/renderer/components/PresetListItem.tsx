import { useRef, useState } from 'react';
import { useMouseDownOutside } from 'renderer/utils/utils';
import IconButton, { IconName } from 'renderer/widgets/IconButton';
import TextInput from 'renderer/widgets/TextInput';

export const formatPresetName = (s: string) => {
  const filteredS = s.replace(/[^a-zA-Z0-9|_|\-| ]+/, '');
  return filteredS.slice(0, 1).toUpperCase() + filteredS.slice(1).toLowerCase();
};

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
          handleChange={handleInputChange}
          handleEscape={handleEscape}
          formatInput={formatPresetName}
          updateOnSubmitOnly
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
              handleClick={handleDelete}
              isDisabled={isDisabled}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PresetListItem;
