import { NotifType as NotifTypeType } from '../../../../store/features/api.slice';

interface INotifType {
  notifType: NotifTypeType;
  username: string;
}

const NotifType = ({ notifType, username }: INotifType) => {
  switch (notifType) {
    case 'FOLLOW':
      return (
        <p>
          <span className="text-purple-eminence">{username}</span> started
          following you
        </p>
      );
    case 'LIKE':
      return (
        <p>
          <span className="text-purple-eminence">{username}</span> liked your
          post
        </p>
      );
    case 'REPLY':
      return (
        <p>
          <span className="text-purple-eminence">{username}</span> commented on
          your post
        </p>
      );
    case 'REPOST':
      return (
        <p>
          <span className="text-purple-eminence">{username}</span> reposted your
          content
        </p>
      );
    default:
      return <p>Unhandled type: {notifType}</p>;
  }
};

export default NotifType;
