import { toast } from 'react-toastify';
import { Formik } from 'formik';

import { Box, Grid, Divider } from '@material-ui/core';

import UnionBanner from '../../organisms/UnionBanner/UnionBanner';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';

const MAX_IMAGES = 4;
const UnionBannersForm = ({ banners = [], create, remove, updateImages, updateVisibility }) => {
  const removeBanner = (values, setFieldValue) => (banner) => {
    const newBanners = [...values.banners].filter(({ index }) => index !== banner.index);
    setFieldValue('banners', newBanners);
  };

  const toggleBannerVisibility = (values, setFieldValue, index) => (banner) => {
    const newBanners = [...values.banners];
    const bannerToChange = newBanners.findIndex(banner => banner.index === index);
    newBanners[bannerToChange] = {...banner, enabled: !banner.enabled}
    setFieldValue('banners', newBanners);
  };

  const onCropHandle = (values, setFieldValue, index: number) => (ref, size: string) => {
    values.banners[index] = { ...values.banners[index], [`cropperRef-${size}`]: ref };
  };

  const onDropHandle = (values, setFieldValue, index: number) => (acceptedFiles, size: string) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const newBanners = [...values.banners];
        const bannerIndex = newBanners.findIndex((banner) => banner.index === index);
        if (size) {
          newBanners[bannerIndex] = { ...newBanners[bannerIndex], [size]: reader.result };
        } else if (bannerIndex !== -1) {
          //new item
          newBanners[bannerIndex] = { ...newBanners[bannerIndex], large: reader.result, small: reader.result };
        } else {
          newBanners.push({ index, large: reader.result, small: reader.result, enabled: true });
        }
        setFieldValue('banners', newBanners);
      };
    });
  };

  const getBanner = (index: number) => banners.find((banner) => banner.index === index);

  const submitBannerHandle = async (banner) => {
    if (banner?.id) {
      if (!banner?.large) {
        remove(banner.id);
        return;
      }

      const initBanner = getBanner(banner.index);
      const updateBanner = (type: string, newBanner: string) => updateImages(banner.id, type, newBanner);

      if (initBanner.large !== banner.large) {
        updateBanner(
          'large',
          banner['cropperRef-large']
            ? banner['cropperRef-large'].current.cropper.getCroppedCanvas().toDataURL()
            : banner.large
        );
      }

      if (initBanner.small !== banner.small) {
        updateBanner(
          'small',
          banner['cropperRef-small']
            ? banner['cropperRef-small'].current.cropper.getCroppedCanvas().toDataURL()
            : banner.small
        );
      }

      if (initBanner.enabled !== banner.enabled) {
        updateVisibility(banner.id, banner.enabled)
      }

      return;
    }

    if (banner?.large) {
      await create({
        index: banner.index,
        small: banner['cropperRef-small']
          ? banner['cropperRef-small'].current.cropper.getCroppedCanvas().toDataURL()
          : banner.small,

        large: banner['cropperRef-large']
          ? banner['cropperRef-large'].current.cropper.getCroppedCanvas().toDataURL()
          : banner.large,
        enabled: banner.enabled
      });
      return;
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        banners,
        submit: null,
      }}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          const updateImagesPromises = values.banners.map((banner) => submitBannerHandle(banner));
          await Promise.all(updateImagesPromises);
          const imageToRemovePromises = banners.map((oldBanner) => {
            if (!values.banners.find((newBanner) => newBanner.index === oldBanner.index)) {
              remove(oldBanner.id);
            }
          });

          await Promise.all(imageToRemovePromises);

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Баннеры обновлены!');
        } catch (err) {
          console.error(err);
          toast.error(formatServerError(err));
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, values, isValid, dirty, handleReset, setFieldValue }): JSX.Element => (
        <form onSubmit={handleSubmit}>
          <Divider />
          <Box sx={{ pt: 3 }}>
            <Grid container mb={1} gap={3}>
              {values.banners.map((banner) => (
                <UnionBanner
                  key={banner.index}
                  toggleVisibility={toggleBannerVisibility(values, setFieldValue, banner.index)}
                  remove={removeBanner(values, setFieldValue)}
                  banner={banner}
                  onDrop={onDropHandle(values, setFieldValue, banner.index)}
                  onCrop={onCropHandle(values, setFieldValue, banner.index)}
                />
              ))}
              {values.banners.length < MAX_IMAGES && (
                <UnionBanner
                  remove={removeBanner(values, setFieldValue)}
                  toggleVisibility={
                    toggleBannerVisibility(
                        values,
                        setFieldValue,
                        values.banners.length ? Math.max(...values.banners.map((banner) => banner.index)) + 1 : 0
                      )}
                  banner={{
                    index: values.banners.length ? Math.max(...values.banners.map((banner) => banner.index)) + 1 : 0,
                    enabled: true
                  }}
                  onDrop={onDropHandle(
                    values,
                    setFieldValue,
                    values.banners.length ? Math.max(...values.banners.map((banner) => banner.index)) + 1 : 0
                  )}
                  onCrop={onCropHandle(values, setFieldValue, 0)}
                />
              )}
            </Grid>
            <Divider />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button color="light" disabled={!dirty} onClick={handleReset}>
                ОТМЕНИТЬ
              </Button>
              <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
                СОХРАНИТЬ ИЗМЕНЕНИЯ
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default UnionBannersForm;
