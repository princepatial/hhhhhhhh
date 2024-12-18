import { BaseIconProps } from '@interfaces/base-icon-props.interface';
import colorScheme from '@helpers/color-scheme';

const PencilIconComponent = ({
  width = 13,
  height = 13,
  color = colorScheme.green
}: BaseIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.862 0.528687C8.98702 0.403706 9.15656 0.333496 9.33333 0.333496C9.51011 0.333496 9.67965 0.403706 9.80467 0.528687L12.4713 3.19535C12.5963 3.32037 12.6665 3.48991 12.6665 3.66669C12.6665 3.84346 12.5963 4.013 12.4713 4.13802L3.80467 12.8047C3.67967 12.9297 3.51013 13 3.33333 13H0.666667C0.489856 13 0.320286 12.9298 0.195262 12.8048C0.0702379 12.6797 0 12.5102 0 12.3334V9.66669C3.77583e-05 9.48989 0.0703004 9.32035 0.195333 9.19535L6.862 2.52869L8.862 0.528687ZM7.33333 3.94269L1.33333 9.94269V11.6667H3.05733L9.05733 5.66669L7.33333 3.94269ZM10 4.72402L11.0573 3.66669L9.33333 1.94269L8.276 3.00002L10 4.72402Z"
        fill={color}
      />
    </svg>
  );
};

export default PencilIconComponent;
