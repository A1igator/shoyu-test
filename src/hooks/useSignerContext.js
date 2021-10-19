import { useContext } from 'react';
import { SignerContext } from '../components/SignerContextProvider';

const useSignerContext = () => useContext(SignerContext);

export default useSignerContext;
