import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { CgMenuRightAlt } from 'react-icons/cg';

import { Dispatch, SetStateAction } from 'react';

interface INav {
  setNavOpen: Dispatch<SetStateAction<boolean>>;
}

const Nav = ({ setNavOpen }: INav) => {
  // const [pendingNotif, setPendingNotif] = useState([]);
  // const [newNotif, setNewNotif] = useState(false);
  // const user = useAppSelector((s) => s.user.user);
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  // const [logout] = useLogoutMutation();

  // const onSignout = async () => {
  //   const result = await logout();

  //   if (!('error' in result)) {
  //     socket.emit<`${EVENTS}`>('DISCONNECT', { username: user?.username });
  //     socket.disconnect();
  //     dispatch(clearUser());
  //     navigate('/auth', { replace: true });
  //   }
  // };

  return (
    <header className="px-2 md:px-[11px] lg:px-[44px] xl:px-0 xl:max-w-screen-xl mx-auto">
      <Navbar fluid rounded className="dark:bg-black-rich">
        <Link to="/">
          <h2 className="text-xl xl:text-2xl text-white-powder font-lobster">
            Litee.
          </h2>
        </Link>

        <div className="flex md:order-2">
          <div className="flex items-center gap-4">
            <CgMenuRightAlt
              className="cursor-pointer xl:hidden"
              size={24}
              onClick={() => setNavOpen(true)}
            />
            {/* <Tooltip content="post..." placement="bottom-end">
              <MdAddBox
                size={25}
                onClick={() =>
                  dispatch(
                    setPostInputModalOpen({
                      val: true,
                      element: <PostInput />,
                    }),
                  )
                }
                className="cursor-pointer"
              />
            </Tooltip> */}

            {/* <Dropdown
              inline
              dismissOnClick
              arrowIcon={false}
              className="dark:bg-black-rich-tint text-white-powder"
              placement="bottom-end"
              label={
                newNotif ? (
                  <MdNotificationsActive
                    size={25}
                    className="text-purple-eminence"
                  />
                ) : (
                  <MdNotifications size={25} className="text-white-powder" />
                )
              }
            >
              <div className="px-4 py-2">
                {pendingNotif.length > 0 ? (
                  <ul className="flex flex-col gap-1">
                    {pendingOrder.map((order) => (
                        <p key={order.orderId}>
                          New pending order{' '}
                          <span
                            className="font-medium text-purple-eminence underline cursor-pointer"
                            onClick={() =>
                              onNewOrder(order.orderId, order.shopId)
                            }
                          >
                            #{order.orderId}
                          </span>
                        </p>
                      ))}
                    NOTIF!!!
                  </ul>
                ) : (
                  'No notification yet'
                )}
                {pendingNotif.length > 0 && (
                  <p
                    className="font-medium rounded-sm text-center mt-2 cursor-pointer bg-purple-eminence py-1 px-3"
                    onClick={() => clearNotification()}
                  >
                    Mark all as viewed
                  </p>
                )}
              </div>
            </Dropdown> */}

            {/* <div className="block xl:hidden">
              <Dropdown
                inline
                dismissOnClick
                arrowIcon={false}
                placement="bottom-end"
                label={
                  user?.profileImage ? (
                    <Avatar
                      alt="User settings"
                      img={user.profileImage}
                      rounded
                    />
                  ) : (
                    <FaUserCircle className="text-white-powder" size={25} />
                  )
                }
                className="dark:bg-black-rich-tint"
              >
                <Dropdown.Header>
                  <span className="flex items-center text-sm">
                    <HiOutlineUserCircle size={20} />
                    <span className="ml-1">{user?.username}</span>
                  </span>
                </Dropdown.Header>
                <Link to="/profile">
                  <Dropdown.Item>
                    <span className="flex items-center truncate text-sm gap-1 mb-2 mt-1">
                      <HiOutlineClipboardList size={20} />
                      Profile
                    </span>
                  </Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={onSignout}
                  className="font-bold flex items-center gap-1"
                >
                  <HiOutlineLogin size={20} />
                  <span>Sign out</span>
                </Dropdown.Item>
              </Dropdown>
            </div> */}
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default Nav;
