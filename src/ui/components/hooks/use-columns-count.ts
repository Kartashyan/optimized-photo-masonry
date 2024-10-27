import { useEffect, useState } from "react";
import { appConfigs } from "../../../infrastructure/app-configs";

export function useColumnsCount(options: {
  columnWidth: number;
  gap: number;
} | undefined = { columnWidth: appConfigs.imageGrid.columnWidth, gap: appConfigs.imageGrid.gap }) {
  const { columnWidth, gap } = options;

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