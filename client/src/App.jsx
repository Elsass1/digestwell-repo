import { useEffect, useState } from 'react';
import './App.css';
import { getEntries } from './apiService';
import EntriesForm from './components/EntriesForm/EntriesForm';
import EntriesList from './components/EntriesList/EntriesList';

function App() {
  const [entriesList, setEntriesList] = useState([]);

  useEffect(() => {
    getEntries().then((data) => setEntriesList(data));
  }, []);

  return (
    <>
      <EntriesForm />
      <EntriesList entriesList={entriesList} />
    </>
  );
}

export default App;