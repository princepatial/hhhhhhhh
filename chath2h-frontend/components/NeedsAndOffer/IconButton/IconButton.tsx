import Image, { StaticImageData } from 'next/image';

type Props = {
  icon: StaticImageData;
  alt: string;
};

const IconButton = ({ icon, alt }: Props) => {
  return <Image src={icon} alt={alt} />;
};
export default IconButton;
