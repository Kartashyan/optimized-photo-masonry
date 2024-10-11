import { useContext, useState, useEffect, useCallback } from "react";
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
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
  &:disabled {
    background-color: #ccc;
    pointer-events: none;
  }
`;

export const SettingsPage: React.FC = () => {
  const appSettings = useContext(AppConfigsContext);
  const dispatch = useContext(AppConfigsDispatchContext);

  const [formState, setFormState] = useState({
    accessKey: appSettings.ACCESS_KEY,
    defaultQuery: appSettings.search.defaultQuery,
    perPage: appSettings.search.perPage,
    orderBy: appSettings.search.orderBy,
    debounceDelay: appSettings.search.debounceDelay,
    columnWidth: appSettings.imageGrid.columnWidth,
    gap: appSettings.imageGrid.gap,
    lazyLoadOffset: appSettings.imageGrid.lazyLoadOffset,
    loadOffset: appSettings.imageGrid.loadOffset,
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(
      formState.accessKey !== appSettings.ACCESS_KEY ||
      formState.defaultQuery !== appSettings.search.defaultQuery ||
      formState.perPage !== appSettings.search.perPage ||
      formState.orderBy !== appSettings.search.orderBy ||
      formState.debounceDelay !== appSettings.search.debounceDelay ||
      formState.columnWidth !== appSettings.imageGrid.columnWidth ||
      formState.gap !== appSettings.imageGrid.gap ||
      formState.lazyLoadOffset !== appSettings.imageGrid.lazyLoadOffset ||
      formState.loadOffset !== appSettings.imageGrid.loadOffset
    );
  }, [formState, appSettings]);

  const updateConfigs = useCallback(() => {
    const updatedConfigs = {
      ACCESS_KEY: formState.accessKey,
      search: {
        defaultQuery: formState.defaultQuery,
        perPage: formState.perPage,
        orderBy: formState.orderBy,
        debounceDelay: formState.debounceDelay,
      },
      imageGrid: {
        columnWidth: formState.columnWidth,
        gap: formState.gap,
        lazyLoadOffset: formState.lazyLoadOffset,
        loadOffset: formState.loadOffset,
        img: {
          loading: "lazy",
        } as Pick<HTMLImageElement, "loading">,
      },
    };
    dispatch({ type: 'UPDATE_CONFIGS', payload: updatedConfigs });
  }, [formState, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <PageContainer>
      <Title>Settings</Title>
      <FormGroup>
        <Label>API Access Key:</Label>
        <Input name="accessKey" value={formState.accessKey} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Default Query:</Label>
        <Input name="defaultQuery" value={formState.defaultQuery} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Per Page:</Label>
        <Input type="number" name="perPage" value={formState.perPage} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Order By:</Label>
        <Input name="orderBy" value={formState.orderBy} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Debounce Delay:</Label>
        <Input type="number" name="debounceDelay" value={formState.debounceDelay} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Image Grid Columns:</Label>
        <Input type="number" name="columnWidth" value={formState.columnWidth} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Image Grid Gap:</Label>
        <Input type="number" name="gap" value={formState.gap} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Lazy Load Offset:</Label>
        <Input type="number" name="lazyLoadOffset" value={formState.lazyLoadOffset} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Load Offset:</Label>
        <Input type="number" name="loadOffset" value={formState.loadOffset} onChange={handleChange} />
      </FormGroup>
      <Button onClick={updateConfigs} disabled={!isChanged}>Update Configs</Button>
      {formState.accessKey ? (
        <StyledLink to="/">Go to Photos Page</StyledLink>
      ) : (
        <span style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#ccc', color: 'white', textDecoration: 'none', borderRadius: '4px', textAlign: 'center', pointerEvents: 'none' }}>Go to Photos Page</span>
      )}
    </PageContainer>
  );
}

export default SettingsPage;