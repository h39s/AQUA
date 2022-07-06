import { FilterTypeEnum } from 'common/constants';

const FilterTypeIcon = ({ type }: { type: FilterTypeEnum }) => {
  switch (type) {
    case FilterTypeEnum.PEAK:
      return (
        <svg
          width="32"
          height="16"
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line y1="11" x2="31.9991" y2="11" stroke="white" strokeWidth="2" />
          <path
            d="M0 14C0 14 5.77285 14 8.64969 14C11.5265 14 13.4444 2 15.9377 2C18.4309 2 20.3488 14 23.6092 14C26.8696 14 32 14 32 14"
            stroke="#4F6EF7"
            strokeWidth="2"
          />
          <line x1="1" x2="1" y2="16" stroke="white" strokeWidth="2" />
        </svg>
      );
    case FilterTypeEnum.NO:
      return (
        <svg
          width="32"
          height="16"
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line y1="11" x2="31.9991" y2="11" stroke="white" strokeWidth="2" />
          <path
            d="M32 2C32 2 26.2271 2 23.3503 2C20.4735 2 18.5556 14 16.0623 14C13.5691 14 11.6512 2 8.39077 2C5.13036 2 5.96046e-07 2 5.96046e-07 2"
            stroke="#F74FC2"
            strokeWidth="2"
          />
          <line x1="1" x2="1" y2="16" stroke="white" strokeWidth="2" />
        </svg>
      );
    default:
      return <></>;
  }
};

export default FilterTypeIcon;
