type SideBarSectionProps = {
  title?: string;
  children: React.ReactNode;
};

export function SideBarSection({ title, children }: SideBarSectionProps) {
  return (
    <ul className="grid gap-1 text-center w-full">
      {title && (
        <li className="grid place-items-center p-4 text-[18px] font-semibold text-accent-foreground">
          {title}
        </li>
      )}

      {children}
    </ul>
  );
}
