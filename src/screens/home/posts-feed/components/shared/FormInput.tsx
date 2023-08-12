import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { FormEvent, MutableRefObject } from 'react';

import ErrorHandler from '../../../../../components/ui/ErrorHandler';
import Spinner from '../../../../../components/ui/Spinner';
import ProfileImage from '../../../../../components/ui/ProfileImage';

interface IFormInput {
  profileImage?: string;
  isLoading: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  commentError?: string;
  commentRef: MutableRefObject<HTMLTextAreaElement | null>;
  error: FetchBaseQueryError | SerializedError | undefined;
  placeholder: string;
  buttonLabel: string;
}

const FormInput = ({
  buttonLabel,
  placeholder,
  commentError,
  commentRef,
  error,
  handleSubmit,
  isLoading,
  profileImage,
}: IFormInput) => {
  return (
    <div className="w-full flex gap-3">
      <div>
        <ProfileImage src={profileImage} size={8} />
      </div>

      <div className="w-full border border-black-rich-tint rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="w-full px-1 py-2">
            <textarea
              id="comment"
              className="placeholder:text-sm overflow-auto w-full text-sm text-gray-900 border-0 dark:bg-black-rich focus:ring-0 dark:text-white-powder dark:placeholder-gray-400"
              placeholder={placeholder}
              rows={3}
              ref={commentRef}
            ></textarea>
          </div>

          <div className="w-full h-[1px] bg-black-rich-tint"></div>

          <div className="flex items-baseline">
            <button
              type="submit"
              disabled={false}
              className="inline-flex items-center my-2 mx-3 py-2.5 px-4 text-xs font-medium text-center text-white-powder  rounded-md focus:ring-1 dark:focus:ring-white-powder hover:bg-purple-eminence"
            >
              {isLoading ? <Spinner /> : buttonLabel}
            </button>
            {error && <ErrorHandler error={error} />}
            {commentError && (
              <p role="alert" className="text-xs text-rose-700 mt-2 font-bold ">
                <sup>*</sup> {commentError}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormInput;
