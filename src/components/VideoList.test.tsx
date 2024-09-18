import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoList from './VideoList';

describe('VideoList', () => {
  it('displays a search bar', () => {
    render(<VideoList />);
    const searchBar = screen.getByPlaceholderText(/search videos/i);
    expect(searchBar).toBeInTheDocument();
  });

  it('displays skeleton cards while loading', () => {
    render(<VideoList />);
    const skeletons = screen.getAllByRole('presentation');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('filters videos based on search input', () => {
    render(<VideoList />);
    const searchBar = screen.getByPlaceholderText(/search videos/i);
    fireEvent.change(searchBar, { target: { value: 'test video' } });
    // Check that videos are filtered based on the input
    const noVideosMessage = screen.getByText(/no videos match your search/i);
    expect(noVideosMessage).toBeInTheDocument();
  });
});