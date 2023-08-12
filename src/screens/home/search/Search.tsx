import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import useSearch from '../../../hooks/useSearch';
import { useAppSelector } from '../../../store/store';
import { Link } from 'react-router-dom';
import RepostHeader from '../posts-feed/components/shared/RepostHeader';

const Search = () => {
  const [username, setUsername] = useState('');
  const { data, isLoading, error } = useSearch(username);
  const user = useAppSelector((s) => s.user.user);

  const userResult =
    data && data.filter((el) => el.username !== user?.username);

  return (
    <div className="w-full md:w-3/4 px-4 md:px-0 relative mx-auto text-sm h-full">
      <Helmet>
        <title>Search | Litee.</title>
      </Helmet>

      <header>
        <div className="flex items-baseline gap-2">
          <label htmlFor="username" className="block mb-2 text-lg font-medium">
            Search:
          </label>

          <div className="">
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full p-2 rounded-lg text-xs focus:ring-blue-cerulean dark:bg-black-rich dark:border-black-rich dark:placeholder-gray-400 dark:text-white-powder dark:focus:ring-blue-cerulean dark:focus:border-blue-cerulean"
              placeholder="find user..."
            />
          </div>
        </div>
        <div className="w-full h-[1px] bg-black-rich-tint -mt-[2px] z-10 mb-5"></div>
      </header>

      {username !== '' &&
        (!isLoading && userResult && userResult.length > 0 ? (
          userResult.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.username}`}
              className="cursor-pointer"
            >
              <RepostHeader
                username={user.username}
                profileImage={user.profileImage}
                withCreatedAt={false}
                usernameClickable={false}
              />
            </Link>
          ))
        ) : (
          <p className="mb-2">no user found...</p>
        ))}
    </div>
  );
};

export default Search;
