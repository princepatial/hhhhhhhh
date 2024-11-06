import { BaseIconProps } from '@interfaces/base-icon-props.interface';
import colorScheme from '@helpers/color-scheme';

const MessageBubbleIconComponent = ({
  width = 20,
  height = 20,
  color = colorScheme.green
}: BaseIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none">
      <path
        d="M4.99935 11.6667H11.666V10.0001H4.99935V11.6667ZM4.99935 9.16675H14.9993V7.50008H4.99935V9.16675ZM4.99935 6.66675H14.9993V5.00008H4.99935V6.66675ZM1.66602 18.3334V3.33342C1.66602 2.87508 1.82935 2.48258 2.15602 2.15592C2.48268 1.82925 2.8749 1.66619 3.33268 1.66675H16.666C17.1243 1.66675 17.5168 1.83008 17.8435 2.15675C18.1702 2.48342 18.3332 2.87564 18.3327 3.33342V13.3334C18.3327 13.7917 18.1693 14.1842 17.8427 14.5109C17.516 14.8376 17.1238 15.0006 16.666 15.0001H4.99935L1.66602 18.3334ZM4.29102 13.3334H16.666V3.33342H3.33268V14.2709L4.29102 13.3334Z"
        fill={color}
      />
    </svg>
  );
};

export default MessageBubbleIconComponent;
