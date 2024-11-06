import getConfig from 'next/config';

const useImageUrl = (imageId: string) => {
  const { publicRuntimeConfig } = getConfig();
  const isTestEnvironment = publicRuntimeConfig?.backendUrl;

  if (!isTestEnvironment) {
    if (typeof location === 'undefined') return '';
    return `${location.origin}/api/files/${imageId}`;
  }

  return `${publicRuntimeConfig.backendUrl}/files/${imageId}`;
};

export default useImageUrl;
