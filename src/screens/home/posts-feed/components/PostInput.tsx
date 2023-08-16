import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdOutlineAddBox } from 'react-icons/md';

import {
  PostValidationSchema,
  postValidationSchema,
} from '../../../../schemas/post.schema';
import { uploadImage } from '../../../../utils/cloudinary.util';
import { useCreatePostMutation } from '../../../../store/features/api.slice';
import ErrorHandler from '../../../../components/ui/ErrorHandler';
import Spinner from '../../../../components/ui/Spinner';
import { useAppDispatch } from '../../../../store/store';
import { setPostInputModalOpen } from '../../../../store/features/post.slice';
import { toast } from 'react-hot-toast';
import useClearFileInputError from '../../../../hooks/useClearFileInputError';

const PostInput = () => {
  const [uploadState, setuploadState] = useState({
    uploadLoading: false,
    uploadError: '',
  });
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    reset,
  } = useForm<PostValidationSchema>({
    resolver: zodResolver(postValidationSchema),
    defaultValues: { media: '' },
    mode: 'onChange',
  });
  const [createPost, { isLoading, error }] = useCreatePostMutation();
  useClearFileInputError(
    errors.media,
    () => {
      reset({ media: '' });
      clearErrors('media');
    },
    2500,
  );

  const onSubmit = async ({ post, media }: PostValidationSchema) => {
    setuploadState({ uploadError: '', uploadLoading: true });

    let currentImage: string | undefined;
    if (media instanceof FileList && media.length > 0) {
      const { data, error } = await uploadImage(media[0]);
      if (error) {
        setuploadState({ uploadError: error, uploadLoading: false });

        return;
      }

      currentImage = data?.url;
    } else {
      currentImage = '';
    }

    const result = await createPost({
      description: post,
      media: currentImage ? currentImage : '',
    });

    if (!('error' in result)) {
      reset();
      dispatch(setPostInputModalOpen({ val: false, element: undefined }));
      toast.success('Post created!');
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-11/12 p-4 lg:w-1/2 xl:w-1/3 md:p-8 bg-black-rich rounded-md border border-black-rich-tint"
    >
      <div>
        <h2 className="flex items-center gap-2">
          <MdOutlineAddBox size={22} /> Post
        </h2>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mb-4 rounded-md bg-black-rich-tint ">
          <div className="px-4 py-2 rounded-t-md dark:bg-black-rich border border-black-rich-tint">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              className="placeholder:text-sm overflow-auto w-full px-0 text-sm text-gray-900 border-0 dark:bg-black-rich focus:ring-0 dark:text-white-powder dark:placeholder-gray-400"
              placeholder="What is happening!?"
              rows={7}
              required
              {...register('post')}
            ></textarea>
          </div>

          <div className="flex items-center justify-between px-3 py-2 dark:bg-black-rich border-b border-l border-r rounded-b-md border-black-rich-tint">
            <div className="flex pl-0 space-x-1 sm:pl-2">
              {!errors.media?.message &&
              watch('media') &&
              watch('media') instanceof FileList &&
              watch('media').length > 0 ? (
                <div className="relative w-20 h-12">
                  <img
                    src={URL.createObjectURL(watch('media')[0])}
                    alt={'image upload'}
                    className="block w-full h-full object-cover"
                  />
                  <IoIosCloseCircle
                    size={16}
                    className="absolute cursor-pointer -top-1 -right-1"
                    onClick={() => setValue('media', '')}
                  />
                </div>
              ) : (
                <label
                  htmlFor="media"
                  className="inline-flex justify-center items-center p-2 text-gray-500 rounded-md cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-purple-eminence"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                  <span className="sr-only">Upload media</span>
                  <input
                    type="file"
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    id="media"
                    className="hidden"
                    {...register('media')}
                  />
                </label>
              )}
              <>
                {(errors.post && (
                  <p
                    role="alert"
                    className="text-xs text-rose-700 mt-2 font-bold "
                  >
                    <sup>*</sup> {errors.post.message as string}
                  </p>
                )) ||
                  (errors.media && (
                    <p
                      role="alert"
                      className="text-xs text-rose-700 mt-2 font-bold "
                    >
                      <sup>*</sup> {errors.media.message as string}
                    </p>
                  ))}
                {error && <ErrorHandler error={error} />}
              </>
            </div>
            <button
              type="submit"
              disabled={uploadState.uploadLoading || isLoading}
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white-powder  rounded-md focus:ring-1 dark:focus:ring-white-powder hover:bg-purple-eminence"
            >
              {uploadState.uploadLoading || isLoading ? <Spinner /> : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostInput;
