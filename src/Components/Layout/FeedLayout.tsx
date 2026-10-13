import { useMediaQuery } from "../../Hooks/useMediaQuery/useMediaQuery";

function FeedLayout({
  children,
  left,
  right,
  top,
}: {
  children: React.ReactNode;
  left?: React.ReactNode; 
  right?: React.ReactNode;
  top?: React.ReactNode; 
}) {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <div className="flex justify-center gap-6 w-full px-3 pb-10">
      {isDesktop && (
        <aside className="w-64 shrink-0">
          <div className="sticky top-28">{left}</div>
        </aside>
      )}

      <main className="w-2xl max-w-full min-w-0 flex flex-col gap-5">
        {!isDesktop && top}
        {children}
      </main>

      {isDesktop && (
        <aside className="w-80 shrink-0">
          <div className="sticky top-28">{right}</div>
        </aside>
      )}
    </div>
  );
}

export default FeedLayout;