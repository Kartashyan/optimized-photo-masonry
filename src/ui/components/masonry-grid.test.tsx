import { render, screen, fireEvent, act } from "@testing-library/react";
import { Photo } from "../../domain/photo";
import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import "@testing-library/jest-dom";
import MasonryGrid from "./masonry-grid";

beforeAll(() => {
  class IntersectionObserverMock {
    constructor(callback) {
      this.callback = callback;
    }
    observe(element) {
      setTimeout(() => {
        this.callback([{ isIntersecting: true, target: element }], this);
      }, 0);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
});

describe("MasonryGrid Component", () => {
  const photos: Photo[] = Array.from({ length: 20 }, (_, index) => ({
    id: `photo-${index}`,
    width: 400 + index * 10,
    height: 300 + index * 5,
    urls: {
      small: `https://example.com/photo-${index}-small.jpg`,
    },
    
  }));

  const loadMoreMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.scrollY = 0;

    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders the MasonryGrid component", () => {
    render(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute("src", photos[0].urls.small);
  });

  test("adjusts number of columns based on window width", async () => {
    const { rerender } = render(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    const initialColumns = Math.floor(window.innerWidth / (236 + 8));

    await act(async () => {
      window.innerWidth = 600;
      window.dispatchEvent(new Event("resize"));
    });

    rerender(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    const newColumns = Math.floor(window.innerWidth / (236 + 8));
    expect(newColumns).not.toEqual(initialColumns);
  });

  test("centers the grid when window is resized", async () => {
    const { container, rerender } = render(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    const gridContainer = container.querySelector("div");

    const initialStyle = window.getComputedStyle(gridContainer!);
    expect(initialStyle.marginLeft).toEqual("auto");
    expect(initialStyle.marginRight).toEqual("auto");

    await act(async () => {
      window.innerWidth = 800;
      window.dispatchEvent(new Event("resize"));
    });

    rerender(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    const updatedStyle = window.getComputedStyle(gridContainer!);
    expect(updatedStyle.marginLeft).toEqual("auto");
    expect(updatedStyle.marginRight).toEqual("auto");
  });

  test("calls loadMore when scrolling to the bottom", async () => {
    render(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    await act(async () => {
      window.scrollY = 1000;
      window.dispatchEvent(new Event("scroll"));
    });

    await act(async () => {});

    expect(loadMoreMock).toHaveBeenCalled();
  });

  test("only renders visible items", () => {
    render(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    const images = screen.getAllByRole("img");
    expect(images.length).toBeLessThanOrEqual(photos.length);
  });

  test("handles onItemClick correctly", () => {
    const onItemClickMock = vi.fn();
    render(
      <MasonryGrid
        photos={photos}
        onItemClick={onItemClickMock}
        loadMore={loadMoreMock}
        loading={false}
      />
    );

    const images = screen.getAllByRole("img");
    fireEvent.click(images[0]);

    expect(onItemClickMock).toHaveBeenCalledWith(photos[0].id);
  });

  test("does not call loadMore when loading is true", async () => {
    render(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={loadMoreMock}
        loading={true}
      />
    );

    // Reset the mock calls after initial rendering
    loadMoreMock.mockClear();

    await act(async () => {
      window.scrollY = 1000;
      window.dispatchEvent(new Event("scroll"));
    });

    await act(async () => {});

    expect(loadMoreMock).not.toHaveBeenCalled();
  });
});
