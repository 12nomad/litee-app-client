import { setPostInputModalOpen } from '../../store/features/post.slice';
import { useAppDispatch, useAppSelector } from '../../store/store';

const PostModal = () => {
  const dispatch = useAppDispatch();
  const modalChildren = useAppSelector((s) => s.post.modalChildren);

  return (
    <div
      className="fixed w-full h-screen z-50 top-0 left-0 bg-black-rich/70 grid place-items-center"
      onClick={() =>
        dispatch(setPostInputModalOpen({ val: false, element: undefined }))
      }
    >
      {modalChildren}
    </div>
  );
};

export default PostModal;
