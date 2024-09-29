import { useEffect, useState } from "react";

export function useResizeColumns({
  columnWidth,
  gap
}: {
  columnWidth: number;
  gap: number;
} = { columnWidth: 236, gap: 8 }) {

  const [columns, setColumns] = useState(
    Math.floor(window.innerWidth / (columnWidth + gap))
  );

  useEffect(() => {
    const handleResize = () => {
      setColumns(Math.floor(window.innerWidth / (columnWidth + gap)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columnWidth, gap]);

  return { columns, columnWidth, gap };
}