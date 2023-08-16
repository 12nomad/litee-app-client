import { MutableRefObject, useEffect } from 'react';

import {
  Room,
  useEditLatestMessageMutation,
} from '../../../../store/features/api.slice';

const useMessageRoom = (
  userId: number,
  roomId: number,
  data: Room | undefined,
  lastMessageRef: MutableRefObject<HTMLParagraphElement | null>,
) => {
  // const [userTyping, setUserTyping] = useState(false);
  const [editLatestMessage] = useEditLatestMessageMutation();

  // useEffect(() => {
  //   FIXME: disabling isTyping feature for now (too many requests)
  //   socket.on<`${EVENTS}`>(
  //     'IS_TYPING',
  //     ({ isTyping }: { isTyping: boolean }) => {
  //       setUserTyping(isTyping ? true : false);
  //     },
  //   );

  //   return () => {
  //     socket.off<`${EVENTS}`>('IS_TYPING');
  //   };
  // }, []);

  useEffect(() => {
    if (data && data.latestMessage?.senderId !== userId) {
      editLatestMessage({
        roomId,
        senderId: data.latestMessage?.senderId || 0,
      });
    }
  }, [data]);

  useEffect(() => {
    lastMessageRef?.current &&
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
  }, [data]);

  // return userTyping;
};

export default useMessageRoom;
