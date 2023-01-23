import { useRef, useState } from 'react';
import { useMouseDownOutside } from 'renderer/utils/utils';
import IconButton, { IconName } from 'renderer/widgets/IconButton';
import TextInput from 'renderer/widgets/TextInput';

const formatPresetName = (s: string) =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();

interface IPresetListItemProps {
  value: string;
  handleChange: (newValue: string) => void;
  handleDelete: () => void;
  isDisabled: boolean;
  validate: (newValue: string) => string | undefined;
}

const PresetListItem = ({
  value,
  handleChange,
  handleDelete,
  isDisabled,
  validate,
}: IPresetListItemProps) => {
  const editValueRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleEditClicked = () => {
    setIsEditMode(true);
  };

  const handleEscape = () => {
    setIsEditMode(false);
  };

  const handleInputChange = (newValue: string) => {
    handleChange(newValue);
    setIsEditMode(false);
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
          handleChange={handleInputChange}
          handleEscape={handleEscape}
          formatInput={formatPresetName}
          validate={validate}
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
