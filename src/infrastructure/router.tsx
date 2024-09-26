import { createBrowserRouter } from 'react-router-dom';
import { loader as masonryGridLoader } from './masonry-grid.loader';
import App from '../App';
import MasonryGrid from '../ui/masonry-grid';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <MasonryGrid />,
        loader: masonryGridLoader,
      },
    ],
  },
]);