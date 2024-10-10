import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AppConfigsContext, AppConfigsDispatchContext } from "../components/contexts/configs-context";

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  &:hover {
    background-color: #0056b3;
  }
`;

export const SettingsPage: React.FC = () => {
  const appSettings = useContext(AppConfigsContext);
  const dispatch = useContext(AppConfigsDispatchContext);

  const keyRef = useRef<HTMLInputElement>(null);
  const defaultQueryRef = useRef<HTMLInputElement>(null);
  const perPageRef = useRef<HTMLInputElement>(null);
  const orderByRef = useRef<HTMLInputElement>(null);
  const debounceDelayRef = useRef<HTMLInputElement>(null);
  const columnWidthRef = useRef<HTMLInputElement>(null);
  const gapRef = useRef<HTMLInputElement>(null);
  const lazyLoadOffsetRef = useRef<HTMLInputElement>(null);
  const loadOffsetRef = useRef<HTMLInputElement>(null);

  const updateConfigs = () => {
    const updatedConfigs = {
      ACCESS_KEY: keyRef.current?.value || appSettings.ACCESS_KEY,
      search: {
        defaultQuery: defaultQueryRef.current?.value || appSettings.search.defaultQuery,
        perPage: perPageRef.current?.valueAsNumber || appSettings.search.perPage,
        orderBy: orderByRef.current?.value || appSettings.search.orderBy,
        debounceDelay: debounceDelayRef.current?.valueAsNumber || appSettings.search.debounceDelay,
      },
      imageGrid: {
        columnWidth: columnWidthRef.current?.valueAsNumber || appSettings.imageGrid.columnWidth,
        gap: gapRef.current?.valueAsNumber || appSettings.imageGrid.gap,
        lazyLoadOffset: lazyLoadOffsetRef.current?.valueAsNumber || appSettings.imageGrid.lazyLoadOffset,
        loadOffset: loadOffsetRef.current?.valueAsNumber || appSettings.imageGrid.loadOffset,
        img: appSettings.imageGrid.img,
      },
    };
    dispatch({ type: 'UPDATE_CONFIGS', payload: updatedConfigs });
  };

  return (
    <PageContainer>
      <Title>Settings</Title>
      <FormGroup>
        <Label>API Access Key:</Label>
        <Input ref={keyRef} defaultValue={appSettings.ACCESS_KEY} />
      </FormGroup>
      <FormGroup>
        <Label>Default Query:</Label>
        <Input ref={defaultQueryRef} defaultValue={appSettings.search.defaultQuery} />
      </FormGroup>
      <FormGroup>
        <Label>Per Page:</Label>
        <Input type="number" ref={perPageRef} defaultValue={appSettings.search.perPage} />
      </FormGroup>
      <FormGroup>
        <Label>Order By:</Label>
        <Input ref={orderByRef} defaultValue={appSettings.search.orderBy} />
      </FormGroup>
      <FormGroup>
        <Label>Debounce Delay:</Label>
        <Input type="number" ref={debounceDelayRef} defaultValue={appSettings.search.debounceDelay} />
      </FormGroup>
      <FormGroup>
        <Label>Image Grid Columns:</Label>
        <Input type="number" ref={columnWidthRef} defaultValue={appSettings.imageGrid.columnWidth} />
      </FormGroup>
      <FormGroup>
        <Label>Image Grid Gap:</Label>
        <Input type="number" ref={gapRef} defaultValue={appSettings.imageGrid.gap} />
      </FormGroup>
      <FormGroup>
        <Label>Lazy Load Offset:</Label>
        <Input type="number" ref={lazyLoadOffsetRef} defaultValue={appSettings.imageGrid.lazyLoadOffset} />
      </FormGroup>
      <FormGroup>
        <Label>Load Offset:</Label>
        <Input type="number" ref={loadOffsetRef} defaultValue={appSettings.imageGrid.loadOffset} />
      </FormGroup>
      <Button onClick={updateConfigs}>Update Configs</Button>
      <StyledLink to="/">Go to Photos Page</StyledLink>
    </PageContainer>
  );
}

export default SettingsPage;