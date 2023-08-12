import { FormEvent, useState } from 'react';
import { BiMessageRoundedEdit } from 'react-icons/bi';
import Spinner from '../../../../components/ui/Spinner';
import { useEditRoomNameMutation } from '../../../../store/features/api.slice';
import { useAppDispatch } from '../../../../store/store';
import { setPostInputModalOpen } from '../../../../store/features/post.slice';

interface IEditRoomNameInput {
  prevTitle?: string;
  roomId: number;
}

const EditRoomNameInput = ({ prevTitle, roomId }: IEditRoomNameInput) => {
  const [title, setTitle] = useState(prevTitle || '');
  const [editRoomName, { isLoading }] = useEditRoomNameMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await editRoomName({ roomId, title });
    if (!('error' in result)) {
      dispatch(setPostInputModalOpen({ val: false, element: undefined }));
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-1/3 p-8 bg-black-rich rounded-md border border-black-rich-tint"
    >
      <div>
        <h2 className="flex items-center gap-2">
          <BiMessageRoundedEdit size={22} /> Edit chat title
        </h2>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </div>

      <form onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="title"
            className="block mb-2 text-sm text-gray-800 dark:text-white-powder"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            name="title"
            className="bg-gray-50 border border-gray-300 text-gray-800 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-black-rich-tint dark:border-gray-600 dark:placeholder-gray-400 dark:text-white-powder dark:focus:ring-blue-cerulean dark:focus:border-blue-cerulean focus:ring-blue-cerulean focus:border-blue-cerulean"
            placeholder="chat title..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white-powder  rounded-md focus:ring-1 dark:focus:ring-white-powder bg-purple-eminence"
        >
          {isLoading ? <Spinner /> : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default EditRoomNameInput;
