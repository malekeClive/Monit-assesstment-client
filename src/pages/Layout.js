import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="flex flex-row items-center justify-center my-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${
              isActive
                ? "text-primary border-b-[1px] border-b-primary"
                : "text-primary border-b-[1px] border-b-transparent hover:border-b-primary"
            } mx-4 pb-1`
          }
        >
          Transfers
        </NavLink>
        <NavLink
          to="/recipients"
          className={({ isActive }) =>
            `${
              isActive
                ? "text-primary border-b-[1px] border-b-primary"
                : "text-primary border-b-[1px] border-b-transparent hover:border-b-primary"
            } mx-4 pb-1`
          }
        >
          Recipients
        </NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
