import React, { useState } from 'react';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const MangaViewer = ({ visible, images, currentIndex, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <ImageViewer
        imageUrls={images.map(image => ({ url: image }))}
        index={currentIndex}
        enableSwipeDown={true}
        onSwipeDown={onClose}
      />
    </Modal>
  );
};

export default MangaViewer;
