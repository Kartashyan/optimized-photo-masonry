import React from 'react';
import styled from 'styled-components';
import { Photo } from '../../domain/photo';

type PhotoDetailsProps = {
  photo: Photo;
  navigateBack: () => void;
};

export const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photo, navigateBack }) => {
  return (
    <Container>
      <Content>
        <BackButton onClick={navigateBack}>← Back</BackButton>
        <ImageWrapper>
          <PhotoImage src={photo.urls.full} alt={photo.alt_description || 'Photo'} />
        </ImageWrapper>
        <Details>
          <Title>{photo.description || photo.alt_description || 'Untitled'}</Title>
          <PhotographerName>By {photo.user.name}</PhotographerName>
          <DateTaken>{new Date(photo.created_at).toLocaleDateString()}</DateTaken>
        </Details>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BackButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: #0073e6;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Details = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

const PhotographerName = styled.p`
  font-size: 18px;
  margin-bottom: 8px;
  color: #555;
`;

const DateTaken = styled.p`
  font-size: 14px;
  color: #777;
`;