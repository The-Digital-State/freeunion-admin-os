import { Box, Icon } from '@material-ui/core';
import ImageDropzone from '../../molecules/ImageDropzone';
import { useState, useRef } from 'react';
import { Cropper } from 'react-cropper';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityOnIcon,
  VisibilityOff as VisibilityOffIcon,
  DesktopMac as DesktopMacIcon,
  PhoneIphone as PhoneIphoneIcon,
} from '@material-ui/icons';

const UnionBanner = ({ onDrop, banner, remove, toggleVisibility, onCrop }) => {
  const cropperRefLarge = useRef<HTMLImageElement>(null);
  const cropperRefSmall = useRef<HTMLImageElement>(null);

  const [isDesktop, setIsDesktop] = useState(true);
  const dropzoneInfo = `Выберите фото размером 1920 / 400 px для десктопной версии.
  Добавьте изображение размером 640 / 320 px для мобильной версии, если это необходимо.`;

  const bannerSections = {
    small: {
      value: banner?.small,
      isDesktop: false,
      width: 400,
      height: 200,
      cropWidth: 400,
      cropperRef: cropperRefLarge,
    },
    large: {
      value: banner?.large,
      isDesktop: true,
      width: 960,
      height: 200,
      cropWidth: 960,
      cropperRef: cropperRefSmall,
    },
  };

  const bannerSection = isDesktop ? bannerSections.large : bannerSections.small;

  return (
    <>
      {!banner?.large ? (
        <ImageDropzone
          dropzoneInfo={dropzoneInfo}
          onDrop={(file) => {
            onDrop(file);
          }}
          accept="image/jpeg"
        />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, width: '100%' }}>
          <Box sx={{ position: 'relative' }}>
            {Object.values(bannerSections).map((block, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  visibility: block.isDesktop !== isDesktop ? 'hidden' : 'visible',
                  position: index ? 'relative' : 'absolute',
                }}
              >
                {
                  // if image has already been uploaded
                  !bannerSection.value?.includes('https') ? (
                    <Cropper
                      key={block.width}
                      src={block.value}
                      style={{ height: block.height, width: block.width }}
                      cropBoxResizable={false}
                      toggleDragModeOnDblclick={false}
                      guides={true}
                      autoCrop={true}
                      minCropBoxWidth={block.cropWidth}
                      minCropBoxHeight={block.height}
                      autoCropArea={1}
                      ref={block.cropperRef}
                      crop={() => onCrop(block.cropperRef, block.isDesktop ? 'large' : 'small')}
                      data={{
                        width: block.cropWidth,
                        height: block.height,
                      }}
                    />
                  ) : (
                    <ImageDropzone
                      value={block.value}
                      onDrop={(file) => {
                        onDrop(file, block.isDesktop ? 'large' : 'small');
                      }}
                      dropzoneInfo={dropzoneInfo}
                      accept="image/jpeg"
                      height={block.height}
                      width={block.width}
                      fullWidthImg
                    />
                  )
                }
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <DesktopMacIcon
                  onClick={() => setIsDesktop(true)}
                  color={bannerSection.isDesktop ? 'action' : 'disabled'}
                />
                <PhoneIphoneIcon
                  onClick={() => setIsDesktop(false)}
                  color={!bannerSection.isDesktop ? 'action' : 'disabled'}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Icon
                  component={banner.enabled ? VisibilityOnIcon : VisibilityOffIcon}
                  color="action"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => toggleVisibility(banner)}
                />
                <DeleteIcon color="action" onClick={() => remove(banner)} sx={{ cursor: 'pointer' }} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UnionBanner;
