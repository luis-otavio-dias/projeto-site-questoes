import { Link } from "react-router";

export function LeftBar() {
  return (
    <div className="h-screen w-64 border-r-2">
      <ul className="flex flex-col gap-4 m-5 p-4 text-left">
        <li>
          <Link
            to="/upload_file"
            className="cursor-pointer transition-all hover:opacity-70"
          >
            Enviar arquivo
          </Link>
        </li>
        <hr />
      </ul>
    </div>
  );
}
