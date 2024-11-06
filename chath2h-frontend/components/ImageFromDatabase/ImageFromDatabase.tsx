import { useEffect, useState } from 'react';
import Image from 'next/image';
const ImageFromDatabase = ({
  mimetype,
  buffer,
  altCounter,
  className
}: {
  mimetype?: string;
  buffer?: Buffer;
  altCounter: string;
  className?: string;
}) => {
  const [needImage, setNeedImage] = useState('');

  useEffect(() => {
    setNeedImage(`data:${mimetype};base64,${buffer}`);
  }, [mimetype, buffer]);
  if (needImage !== '')
    return (
      <Image
        className={className}
        src={needImage}
        alt={'need-image-' + altCounter}
        fill
        key={needImage}
      />
    );
  return null;
};
export default ImageFromDatabase;
