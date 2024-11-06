import { BaseIconProps } from '@interfaces/base-icon-props.interface';
import colorScheme from '@helpers/color-scheme';

const CircleIArrowRightIconComponent = ({
  width = 49,
  height = 48,
  color = colorScheme.white,
  backgroundColor = colorScheme.green
}: BaseIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 49 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect width="48.7793" height="48" rx="24" fill={backgroundColor} />
      <path
        d="M17.9008 15.098C17.1473 14.7381 16.3195 15.4266 16.5346 16.2334L18.1121 22.1277C18.1516 22.2759 18.2338 22.4091 18.3484 22.511C18.4631 22.6128 18.6051 22.6787 18.7569 22.7005L26.4908 23.8053C26.7146 23.8366 26.7146 24.1606 26.4908 24.1927L18.7576 25.2967C18.6059 25.3185 18.4638 25.3844 18.3492 25.4863C18.2346 25.5881 18.1524 25.7214 18.1129 25.8695L16.5346 31.767C16.3195 32.5729 17.1473 33.2615 17.9008 32.9023L34.7224 24.8828C35.4649 24.5291 35.4649 23.4712 34.7224 23.1168L17.9008 15.098Z"
        fill={color}
      />
    </svg>
  );
};

export default CircleIArrowRightIconComponent;
