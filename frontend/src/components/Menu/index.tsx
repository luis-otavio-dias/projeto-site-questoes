import { MenuDropdown } from "../MenuDropdown";

export function Menu() {
  return (
    <header className="flex flex-row items-center p-4 text-primary border-b-2">
      <div className="flex items-center ml-5 ">
        <h1 className="text-4xl font-bold">iStudy</h1>
      </div>

      <nav className="flex flex-row items-center justify-between gap-8 font-semibold w-full">
        <div className="flex m-auto items-center justify-center border-2 rounded-lg">
          Search bar
        </div>

        <div className="flex items-center mr-5">
          <MenuDropdown />
        </div>
      </nav>
    </header>
  );
}
