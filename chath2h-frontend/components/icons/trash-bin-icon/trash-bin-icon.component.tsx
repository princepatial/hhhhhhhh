import { BaseIconProps } from '@interfaces/base-icon-props.interface';
import colorScheme from '@helpers/color-scheme';

const TrashBinIconComponent = ({
  width = 16,
  height = 16,
  color = colorScheme.warning
}: BaseIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3H13V4H12V13L11 14H4L3 13V4H2V3H5V2C5 1.73478 5.10536 1.48043 5.29289 1.29289C5.48043 1.10536 5.73478 1 6 1H9C9.26522 1 9.51957 1.10536 9.70711 1.29289C9.89464 1.48043 10 1.73478 10 2V3ZM9 2H6V3H9V2ZM4 13H11V4H4V13ZM6 5H5V12H6V5ZM7 5H8V12H7V5ZM9 5H10V12H9V5Z"
        fill={color}
      />
    </svg>
  );
};

export default TrashBinIconComponent;
