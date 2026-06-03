import {
  BookOpen,
  BarChart2,
  Heart,
  History,
  ChevronDown,
  GraduationCap,
  LogOut,
  User,
  Upload,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { UserActionTypes } from "../../actions/userActions";
import { api } from "../../services/api";

const navItems = [
  { label: "Meus Estudos", to: "/", icon: BookOpen },
  { label: "Estatísticas", to: "#", icon: BarChart2 },
  { label: "Favoritos", to: "#", icon: Heart },
  { label: "Histórico", to: "#", icon: History },
];

const filterItems = ["Matéria", "Ano", "Prova"];

type SideBarProps = {
  onImportarProva?: () => void;
};

export function SideBar({ onImportarProva }: SideBarProps) {
  const { state, dispatch } = useUserContext();
  const { userInfo } = state;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await api.post("/users/logout/");
    dispatch({ type: UserActionTypes.USER_LOGOUT });
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-64 shrink-0 min-h-screen bg-sidebar dark:bg-[#18181B] border-r border-border dark:border-[#27272A]">
      {/* Logo area */}
      <div className="h-[81px] flex items-center gap-3 px-6 border-b border-border dark:border-[#27272A]">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #2B7FFF 0%, #9810FA 100%)",
          }}
        >
          <GraduationCap className="w-[18px] h-[18px] text-white" />
        </div>
        <span className="text-xl font-semibold text-foreground dark:text-white">
          iStudy
        </span>
      </div>

      {/* Navigation */}
      <nav className="px-4 pt-4 flex flex-col gap-1">
        {navItems.map(({ label, to, icon: Icon }) => {
          const isActive = to === "/" && pathname === "/";
          return (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-base font-medium transition-colors ${
                isActive
                  ? "bg-accent dark:bg-[#27272A] text-foreground dark:text-white"
                  : "text-muted-foreground dark:text-[#9F9FA9] hover:bg-accent dark:hover:bg-[#27272A] hover:text-foreground dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}

        {/* Importar Prova */}
        <button
          onClick={onImportarProva}
          className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-base font-medium transition-colors w-full mt-1 bg-[rgba(43,127,255,0.08)] dark:bg-[rgba(43,127,255,0.08)] text-[#51A2FF] hover:bg-[rgba(43,127,255,0.16)] dark:hover:bg-[rgba(43,127,255,0.16)]"
        >
          <Upload className="w-5 h-5 shrink-0" />
          Importar Prova
        </button>
      </nav>

      {/* Filters */}
      <div className="px-4 mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.025em] text-[#71717B] dark:text-[#71717B] px-2 mb-4">
          Filtros
        </p>
        <div className="flex flex-col gap-4">
          {filterItems.map((filter) => (
            <div key={filter}>
              <p className="text-sm font-medium text-[#9F9FA9] dark:text-[#9F9FA9] px-2 mb-1.5">
                {filter}
              </p>
              <div className="relative">
                <div className="w-full h-[38px] bg-input dark:bg-[#27272A] border border-border dark:border-[#3F3F47] rounded-[10px]" />
                <ChevronDown className="absolute right-3 top-[11px] w-4 h-4 text-[#71717B] pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User section */}
      <div className="mt-auto border-t border-[#27272A] dark:border-[#27272A] px-4 py-4 bg-[rgba(24,24,27,0.5)] dark:bg-[rgba(24,24,27,0.5)]">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #2B7FFF 0%, #9810FA 100%)",
            }}
          >
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground dark:text-white truncate">
              {userInfo?.name ?? "Usuário"}
            </p>
            <p className="text-xs text-[#71717B]">Estudante</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#71717B] hover:text-red-400 transition-colors shrink-0"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
