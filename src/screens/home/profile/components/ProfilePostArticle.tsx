import moment from 'moment';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BiImage } from 'react-icons/bi';

interface IProfilePostArticle {
  createdAt: Date;
  isRepost: boolean;
  media?: string;
  description: string;
}

const ProfilePostArticle = ({
  createdAt,
  description,
  isRepost,
  media,
}: IProfilePostArticle) => {
  return (
    <article>
      <header className="flex items-center gap-2">
        <p>{moment(createdAt).fromNow()}</p>
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
        {media && (
          <>
            <p>
              {' '}
              <sup>.</sup>{' '}
            </p>
            <BiImage size={18} />
          </>
        )}
      </header>

      <p className="mt-1">{description}</p>
      <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
    </article>
  );
};

export default ProfilePostArticle;
