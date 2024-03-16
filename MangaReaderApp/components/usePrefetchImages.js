import { useEffect } from 'react';
import { Image } from 'react-native';

const usePrefetchImages = (imageUrls) => {
  useEffect(() => {
    if (imageUrls && imageUrls.length > 0) {
      imageUrls.forEach((url) => {
        Image.prefetch(url)
          .then(() => console.log(`Prefetched ${url}`))
          .catch((err) => console.error(`Failed to prefetch ${url}`, err));
      });
    }
  }, [imageUrls]);
};

export default usePrefetchImages;
