import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineRetweet } from 'react-icons/ai';
import moment from 'moment';
import ProfileImage from '../../../../../components/ui/ProfileImage';

interface IRepostHeader {
  profileImage?: string;
  username: string;
  createdAt?: Date;
  isRepost?: boolean;
  withCreatedAt?: boolean;
  usernameClickable?: boolean;
}

const RepostHeader = ({
  createdAt,
  username,
  profileImage,
  isRepost = false,
  withCreatedAt = true,
  usernameClickable = true,
}: IRepostHeader) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <ProfileImage src={profileImage} size={8} />

      <p>
        {' '}
        <sup>.</sup>{' '}
      </p>
      {usernameClickable ? (
        <Link
          to={`/profile/${username}`}
          className="text-purple-eminence font-medium hover:underline"
        >
          {username}
        </Link>
      ) : (
        <p className=" font-medium">{username}</p>
      )}
      {withCreatedAt && (
        <>
          <p>
            {' '}
            <sup>.</sup>{' '}
          </p>
          <p>{moment(createdAt).fromNow()}</p>
        </>
      )}
      {isRepost && (
        <>
          <p>
            {' '}
            <sup>.</sup>{' '}
          </p>
          <div className="flex items-center gap-1 text-green-jade">
            <AiOutlineRetweet size={18} />
            repost
          </div>
        </>
      )}
    </div>
  );
};

export default RepostHeader;
