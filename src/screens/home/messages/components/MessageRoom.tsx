import { Helmet } from 'react-helmet-async';
import { IoMdSend } from 'react-icons/io';
import { BiMessageRoundedEdit } from 'react-icons/bi';

import {
  useCreateMessageMutation,
  useGetRoomQuery,
} from '../../../../store/features/api.slice';
import Loading from '../../../../components/ui/Loading';
import ErrorHandler from '../../../../components/ui/ErrorHandler';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { setPostInputModalOpen } from '../../../../store/features/post.slice';
import EditRoomNameInput from './EditRoomNameInput';
import { Avatar } from 'flowbite-react';
import { ChangeEvent, useRef, useState } from 'react';
import useMessageRoom from '../hooks/useMessageRoom';

const MessageRoom = () => {
  const { roomId: id } = useParams<{ roomId: string }>();

  const { data, isLoading, error } = useGetRoomQuery({ id: id ? +id : 0 });
  const [createMessage, { isLoading: messageLoading }] =
    useCreateMessageMutation();
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.user);
  const lastMessageRef = useRef<HTMLParagraphElement | null>(null);
  useMessageRoom(user?.id ? user.id : 0, id ? +id : 0, data, lastMessageRef);

  if (isLoading) return <Loading />;

  if (error) return <ErrorHandler error={error} />;

  const onChangeTitle = () => {
    dispatch(
      setPostInputModalOpen({
        val: true,
        element: (
          <EditRoomNameInput
            prevTitle={data?.roomName}
            roomId={data?.id || 0}
          />
        ),
      }),
    );
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // FIXME: disabling isTyping feature for now (too many requests)
    // socket.emit<`${EVENTS}`>('USER_TYPING', { roomId: id ? +id : 0 });
    setMessage(e.target.value);
  };

  const onSendMessage = async () => {
    const result = await createMessage({ message, roomId: id ? +id : 0 });

    if (!('error' in result)) {
      setMessage('');
    }
  };

  return (
    <div className="w-full md:w-3/4 px-4 md:px-0 relative mx-auto text-sm h-full overflow-hidden">
      <Helmet>
        <title>Chat | Litee.</title>
      </Helmet>

      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {data?.isGroupRoom ? (
              <>
                <div className="flex items-center gap-1">
                  <Avatar.Group>
                    {data?.users
                      .filter((el) => el.id !== user?.id)
                      .slice(0, 2)
                      .map((user) => (
                        <img
                          key={user.id}
                          src={
                            user.profileImage ||
                            'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
                          }
                          alt={user.username + 'avatar'}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      ))}
                  </Avatar.Group>
                  <span>
                    {data?.users.length > 3 && `+${data?.users.length - 3}`}
                  </span>
                </div>
                {data.roomName ? (
                  <p>{data.roomName}</p>
                ) : (
                  <p>
                    {data?.users
                      .filter((el) => el.id !== user?.id)
                      .slice(0, 2)
                      .map((user, idx) => (
                        <span key={user.username}>
                          {`${user.username}${idx === 1 ? ', ...' : ', '}`}
                        </span>
                      ))}
                  </p>
                )}
              </>
            ) : (
              <>
                <img
                  src={
                    (data &&
                      (data.users[0].username === user?.username
                        ? data.users[1].profileImage
                        : data.users[0].profileImage)) ||
                    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
                  }
                  alt={data?.users[0].username + 'avatar'}
                  className="w-8 h-8 object-cover rounded-full"
                />
                <p className="font-medium">
                  {data?.roomName ||
                    (data?.users[0].username === user?.username
                      ? data?.users[1].username
                      : data?.users[0].username)}
                </p>
              </>
            )}
          </div>
          <BiMessageRoundedEdit
            size={22}
            className="cursor-pointer"
            onClick={onChangeTitle}
          />
        </div>
        <div className="w-full h-[1px] bg-black-rich-tint mt-2 mb-5"></div>
      </div>

      <div
        // ref={messageBlockRef}
        className="w-full overflow-y-auto no-scrollbar max-h-[calc(100vh-200px)] mb-10 xl:mb-0"
      >
        {data?.messages.map((message, idx) =>
          !data.isGroupRoom ? (
            <div
              key={message.id}
              className={`flex mt-1 ${
                message.senderId !== user?.id
                  ? `
                  justify-start  
                `
                  : `
                 justify-end 
              `
              }`}
            >
              {data.isGroupRoom &&
                message.senderId !== user?.id &&
                message.senderId !== data?.messages[idx + 1]?.senderId && (
                  <p>{message.sender.username}</p>
                )}

              <p
                ref={lastMessageRef}
                className={`rounded-full max-w-xs py-1 px-2 inline-block break-words ${
                  message.senderId !== user?.id
                    ? `
                 bg-black-rich-tint
              `
                    : `
                bg-purple-eminence
              `
                }`}
              >
                {message.message}
              </p>
            </div>
          ) : (
            <div
              key={message.id}
              className={`relative flex mt-1 ${
                message.senderId !== user?.id
                  ? `
                  justify-start  
                `
                  : `
                 justify-end 
              `
              }`}
            >
              {data.isGroupRoom &&
                message.senderId !== user?.id &&
                message.senderId !== data?.messages[idx + 1]?.senderId && (
                  <p
                    ref={message.senderId !== user?.id ? lastMessageRef : null}
                    className="absolute -bottom-0 left-0 font-extralight"
                  >
                    {message.sender?.username}
                  </p>
                )}

              <p
                ref={message.senderId === user?.id ? lastMessageRef : null}
                className={`rounded-full max-w-xs py-1 px-2 inline-block break-words ${
                  message.senderId !== user?.id
                    ? `
                 bg-black-rich-tint
              `
                    : `
                bg-purple-eminence
              `
                } ${
                  message.senderId !== user?.id &&
                  message.senderId !== data?.messages[idx + 1]?.senderId &&
                  'mb-5'
                }`}
              >
                {message.message}
              </p>
            </div>
          ),
        )}
      </div>

      <div className="absolute bottom-0 left-0 flex items-center gap-2 w-full px-4 md:px-0">
        <div className="w-full">
          {/* {errors.description && (
            <p role="alert" className="text-xs text-rose-800 mt-2">
              {errors.description.message as string}
            </p>
          )} */}
          <textarea
            id="description"
            name="message"
            value={message}
            onChange={onChange}
            className="block resize-none border-0 text-sm w-full text-gray-900 bg-black-rich-tint rounded-full placeholder:text-sm focus:ring-0 focus:border-0 dark:bg-black-rich-tint dark:placeholder-gray-400 dark:text-white-powder dark:focus:ring-purple-cerulean dark:focus:border-purple-cerulean"
            placeholder="write message..."
            rows={1}
          ></textarea>
        </div>
        <button disabled={messageLoading} onClick={onSendMessage}>
          <IoMdSend size={28} className="text-purple-eminence" />
        </button>
      </div>
    </div>
  );
};

export default MessageRoom;
