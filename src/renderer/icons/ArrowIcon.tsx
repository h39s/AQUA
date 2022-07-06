const ArrowIcon = ({
  className = '',
  type,
}: {
  className?: string;
  type: 'up' | 'down';
}) => {
  switch (type) {
    case 'up':
      return (
        <svg
          width="28"
          height="23"
          viewBox="0 0 28 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <g filter="url(#filter0_d_413_31)">
            <path
              d="M13.178 5.18645C13.5757 4.61244 14.4243 4.61244 14.822 5.18645L23.3049 17.4305C23.7644 18.0937 23.2898 19 22.4829 19H5.51707C4.71025 19 4.23559 18.0937 4.69507 17.4305L13.178 5.18645Z"
              fill="#4FC3F7"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_413_31"
              x="0.515137"
              y="0.75592"
              width="26.9697"
              height="22.2441"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_413_31"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_413_31"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    case 'down':
      return (
        <svg
          width="28"
          height="23"
          viewBox="0 0 28 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <g filter="url(#filter0_d_413_49)">
            <path
              d="M13.178 17.8136C13.5757 18.3876 14.4243 18.3876 14.822 17.8136L23.3049 5.56949C23.7644 4.90629 23.2898 4 22.4829 4H5.51707C4.71025 4 4.23559 4.90629 4.69507 5.56949L13.178 17.8136Z"
              fill="#4FC3F7"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_413_49"
              x="0.515137"
              y="0"
              width="26.9697"
              height="22.2441"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_413_49"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_413_49"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    default:
      return null;
  }
};

export default ArrowIcon;
