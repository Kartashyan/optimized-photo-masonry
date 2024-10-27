import styled from "styled-components";

export const SearchArea: React.FC<{
  setSearchText: (text: string) => void;
}> = ({ setSearchText }) => {
  return (
    <SearchHeader>
      <StyledWrapper>
        <StyledInput
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </StyledWrapper>
    </SearchHeader>
  );
};

const SearchHeader = styled.header`
  position: fixed;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
    background: linear-gradient(
    45deg,
    rgba(255, 0, 150, 0.5) 0%,
    rgba(255, 204, 0, 0.5) 100%
  );
  backdrop-filter: blur(10px);
  z-index: 1;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`;

const StyledWrapper = styled.div`
  width: 80%;
  padding: 16px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 70%;
  padding: 16px;
  font-size: 16px;
  margin-bottom: 16px;
  border-radius: 16px;
`;