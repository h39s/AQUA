import { FilterTypeEnum, FilterTypeToLabelMap } from 'common/constants';

const FilterTypeIcon = ({ type }: { type: FilterTypeEnum }) => {
  switch (type) {
    case FilterTypeEnum.PK:
      return (
        <svg
          width="32"
          height="16"
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Peak Filter</title>
          <path
            d="M0 14C0 14 5.77285 14 8.64969 14C11.5265 14 13.4444 2 15.9377 2C18.4309 2 20.3488 14 23.6092 14C26.8696 14 32 14 32 14"
            stroke="#4F6EF7"
            strokeWidth="2"
          />
        </svg>
      );
    // case FilterTypeEnum.LPQ:
    //   return (
    //     <svg
    //       width="32"
    //       height="17"
    //       viewBox="0 0 32 17"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <title>Low Pass Filter</title>
    //       <path
    //         d="M1 2C1 2 10.5 2 13.5 2C16.5 2 20.5 7.50024 22 10.0002C23.5 12.5002 24.5 15.5002 24.5 16.0002"
    //         stroke="#F7844F"
    //         strokeWidth="2"
    //       />
    //     </svg>
    //   );
    // case FilterTypeEnum.HPQ:
    //   return (
    //     <svg
    //       width="32"
    //       height="17"
    //       viewBox="0 0 32 17"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <title>High Pass Filter</title>
    //       <path
    //         d="M32 2C32 2 22.5 2 19.5 2C16.5 2 12.5 7.50024 11 10.0002C9.5 12.5002 8.5 15.5002 8.5 16.0002"
    //         stroke="#4FF7D8"
    //         strokeWidth="2"
    //       />
    //     </svg>
    //   );
    case FilterTypeEnum.LSC:
      return (
        <svg
          width="32"
          height="16"
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Low Shelf Filter</title>
          <path
            d="M1 2.00002C1 2.00002 4.39077 1.99996 8 2C11.6092 2.00004 16.2396 14 19.5 14C22.7604 14 32 14 32 14"
            stroke="#F74FC2"
            strokeWidth="2"
          />
        </svg>
      );
    case FilterTypeEnum.HSC:
      return (
        <svg
          width="32"
          height="16"
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>High Shelf Filter</title>
          <path
            d="M32 2.00002C32 2.00002 28.6092 1.99996 25 2C21.3908 2.00004 16.7604 14 13.5 14C10.2396 14 1 14 1 14"
            stroke="#844FF7"
            strokeWidth="2"
          />
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
          <title>Notch Filter</title>
          <path
            d="M32 2C32 2 26.2271 2 23.3503 2C20.4735 2 18.5556 14 16.0623 14C13.5691 14 11.6512 2 8.39077 2C5.13036 2 0 2 0 2"
            stroke="#F74F6E"
            strokeWidth="2"
          />
        </svg>
      );
    default:
      return <></>;
  }
};

export const FILTER_OPTIONS = Object.values(FilterTypeEnum).map(
  (filterType: FilterTypeEnum) => {
    return {
      value: filterType,
      label: FilterTypeToLabelMap[filterType],
      display: <FilterTypeIcon type={filterType} />,
    };
  }
);

export default FilterTypeIcon;
