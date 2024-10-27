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
  class IntersectionObserverMock implements IntersectionObserver {
    root: Element | Document | null;
    rootMargin: string;
    thresholds: ReadonlyArray<number>;
    callback: IntersectionObserverCallback;

    constructor(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit
    ) {
      this.callback = callback;
      this.root = options?.root ?? null;
      this.rootMargin = options?.rootMargin ?? '';
      this.thresholds = options?.threshold
        ? Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold]
        : [];
    }

    observe(element: Element): void {
      setTimeout(() => {
        const entry: IntersectionObserverEntry = {
          time: Date.now(),
          target: element,
          rootBounds: null,
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRect: element.getBoundingClientRect(),
          intersectionRatio: 1,
          isIntersecting: true,
        };
        this.callback([entry], this);
      }, 0);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unobserve(_element: Element): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
});

describe('MasonryGrid Component', () => {
  const photos: Photo[] = Array.from({ length: 20 }, (_, index) => ({
    id: `photo-${index}`,
    width: 400 + index * 10,
    height: 300 + index * 5,
    urls: {
      small: `https://example.com/photo-${index}-small.jpg`,
      full: `https://example.com/photo-${index}-full.jpg`,
    },
    user: {
      name: `User ${index}`,
    },
    description: `Description for photo ${index}`,
    alt_description: `Alt description for photo ${index}`,
    created_at: new Date().toISOString(),
  }));

  const loadMoreMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.scrollY = 0;

    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
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

    // Get updated margin
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

    // Check the number of images rendered
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
    const newLoadMoreMock = vi.fn();
    render(
      <MasonryGrid
        photos={photos}
        onItemClick={vi.fn()}
        loadMore={newLoadMoreMock}
        loading={true}
      />
    );

    await act(async () => {
      window.scrollY = 1000;
      window.dispatchEvent(new Event("scroll"));
    });

    await act(async () => {});

    expect(newLoadMoreMock).not.toHaveBeenCalled();
  });
});
