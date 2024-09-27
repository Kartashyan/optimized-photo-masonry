import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MasonryGrid } from "./masonry-grid";
import { Photo } from "../../domain/photo";

const mockPhotos: Photo[] = [
  {
    id: "1",
    urls: { small: "photo1-small.jpg", full: "photo1-full.jpg" },
    user: { name: "User 1" },
    description: "Description for Photo 1",
    alt_description: "Alt description for Photo 1",
    created_at: "2023-01-01T00:00:00Z",
    width: 100,
    height: 100,
  },
  {
    id: "2",
    urls: { small: "photo2-small.jpg", full: "photo2-full.jpg" },
    user: { name: "User 2" },
    description: "Description for Photo 2",
    alt_description: "Alt description for Photo 2",
    created_at: "2023-01-02T00:00:00Z",
    width: 200,
    height: 300,
  },
  {
    id: "3",
    urls: { small: "photo3-small.jpg", full: "photo3-full.jpg" },
    user: { name: "User 3" },
    description: "Description for Photo 3",
    alt_description: "Alt description for Photo 3",
    created_at: "2023-01-03T00:00:00Z",
    width: 300,
    height: 200,
  },
];

describe("MasonryGrid", () => {
  it("renders correct number of images", () => {
    render(<MasonryGrid photos={mockPhotos} columns={3} />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(mockPhotos.length);
  });

  it("applies correct span to grid items", () => {
    render(<MasonryGrid photos={mockPhotos} columns={3} />);
    const gridItems = document.querySelectorAll('[data-testid^="grid-item-"]');
    expect(gridItems[0]).toHaveStyle("grid-row-end: span 3");
    expect(gridItems[1]).toHaveStyle("grid-row-end: span 5");
    expect(gridItems[2]).toHaveStyle("grid-row-end: span 2");
  });

  it.skip("uses lazy loading for images", () => {
    render(<MasonryGrid photos={mockPhotos} columns={3} />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  it("renders grid with correct number of columns", () => {
    render(<MasonryGrid photos={mockPhotos} columns={3} />);
    const grid = screen.getByTestId("masonry-grid");
    expect(grid).toHaveStyle("grid-template-columns: repeat(3, 1fr)");
  });
});
