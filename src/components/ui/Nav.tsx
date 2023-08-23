import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { CgMenuRightAlt } from "react-icons/cg";
interface INav {
  toggleNav: (val: boolean) => void;
}

const Nav = ({ toggleNav }: INav) => {
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
              onClick={() => toggleNav(true)}
            />
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default Nav;
