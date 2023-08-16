import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { HiOutlineUserCircle } from 'react-icons/hi';
import {
  ProfileValidationSchema,
  profileValidationSchema,
} from '../../../../schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { IFormField } from '../../../../interfaces/form-fields.interface';
import Input from '../../../../components/form/Input';
import SubmitButton from '../../../../components/form/SubmitButton';
import { useEditUserMutation } from '../../../../store/features/api.slice';
import ImageInput from '../../../../components/form/ImageInput';
import useClearFileInputError from '../../../../hooks/useClearFileInputError';
import { uploadImage } from '../../../../utils/cloudinary.util';
import { useAppDispatch } from '../../../../store/store';
import { setPostInputModalOpen } from '../../../../store/features/post.slice';
import { toast } from 'react-hot-toast';

const profileFields: IFormField<FieldValues>[] = [
  {
    label: 'Username: ',
    name: 'username',
  },
  {
    label: 'Name: ',
    name: 'name',
    placeholder: 'your name...',
  },
];
interface IEditProfileInput {
  description: string;
  name: string;
  username: string;
  profileImage: string;
}

const EditProfileInput = ({
  description,
  name,
  profileImage,
  username,
}: IEditProfileInput) => {
  const [uploadState, setuploadState] = useState({
    uploadLoading: false,
    uploadError: '',
  });
  const [editProfile, { isLoading, error }] = useEditUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    clearErrors,
  } = useForm<ProfileValidationSchema>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      description,
      name,
      username,
      profileImage: profileImage || '',
    },
    mode: 'onChange',
  });
  const dispatch = useAppDispatch();
  useClearFileInputError(
    errors.profileImage,
    () => {
      reset({ profileImage: profileImage || '' });
      clearErrors('profileImage');
    },
    2500,
  );

  const onSubmit = async ({
    username,
    description,
    name,
    profileImage,
  }: ProfileValidationSchema) => {
    setuploadState({ uploadError: '', uploadLoading: true });

    let currentImage: string | undefined;
    if (profileImage instanceof FileList && profileImage.length > 0) {
      const { data, error } = await uploadImage(profileImage[0]);
      if (error) {
        setuploadState({ uploadError: error, uploadLoading: false });

        return;
      }

      currentImage = data?.url;
    } else {
      currentImage = '';
    }

    const result = await editProfile({
      description: description ? description : '',
      profileImage: currentImage ? currentImage : '',
      name: name ? name : '',
      username,
    });

    if (!('error' in result)) {
      reset();
      dispatch(setPostInputModalOpen({ val: false, element: undefined }));
      toast.success('Profile updated!');
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-11/12 p-4 lg:w-1/2 xl:w-1/3 md:p-8 bg-black-rich rounded-md border border-black-rich-tint"
    >
      <div>
        <h2 className="flex items-center gap-2">
          <HiOutlineUserCircle size={22} /> Edit user information
        </h2>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </div>

      <form
        className="space-y-2 md:space-y-4 text-rusty-red"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid place-items-center">
          {!errors.profileImage?.message &&
            watch('profileImage') &&
            watch('profileImage') instanceof FileList &&
            watch('profileImage').length > 0 && (
              <img
                src={URL.createObjectURL(watch('profileImage')[0])}
                alt={username || 'user avatar'}
                className="rounded-full w-32 h-32  object-cover"
              />
            )}
          {(!watch('profileImage') ||
            errors.profileImage?.message === 'max image size is 5MB...' ||
            (watch('profileImage') instanceof FileList &&
              watch('profileImage').length < 1) ||
            typeof watch('profileImage') === 'string') && (
            <img
              src={
                profileImage ||
                'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
              }
              alt={username || 'user avatar'}
              className="rounded-full w-32 h-32  object-cover"
            />
          )}
        </div>

        <ImageInput
          label="Change Profile Image: "
          name="profileImage"
          errors={errors}
          register={register}
        />

        {profileFields.map((el) => (
          <Input
            key={el.name}
            name={el.name}
            label={el.label}
            register={register}
            errors={errors}
            placeholder={el.placeholder}
          />
        ))}

        <div>
          <label
            htmlFor={description}
            className="block mb-2 text-sm text-gray-900 dark:text-white-powder"
          >
            Bio:
          </label>
          <textarea
            id="description"
            className="block text-sm p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 placeholder:text-sm focus:ring-blue-cerulean focus:border-blue-cerulean dark:bg-black-rich-tint dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-cerulean dark:focus:border-blue-cerulean"
            placeholder="write anything you want..."
            rows={2}
            {...register('description')}
          ></textarea>
          {errors.description && (
            <p role="alert" className="text-xs text-rose-800 mt-2">
              {errors.description.message as string}
            </p>
          )}
        </div>

        <SubmitButton
          isLoading={uploadState.uploadLoading || isLoading}
          error={error}
          label="Update"
        />
      </form>
    </div>
  );
};

export default EditProfileInput;
