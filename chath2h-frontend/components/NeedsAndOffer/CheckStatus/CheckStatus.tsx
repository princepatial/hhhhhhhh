type Props = {
  status: 'error' | 'loading' | 'success';
  error: Error | null;
  isData: boolean;
  children?: string | JSX.Element | JSX.Element[];
};

const CheckStatus = ({ status, error, isData, children }: Props) => {
  if (status === 'loading') {
    return <p>Loading...</p>;
  } else if (status === 'error') {
    return <p>Error {error && error.message}</p>;
  } else {
    return <div>{isData && children}</div>;
  }
};

export default CheckStatus;
