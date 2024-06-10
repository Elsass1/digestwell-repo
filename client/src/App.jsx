import { useEffect, useState } from 'react';
import './App.css';
import { getEntries } from './apiService';
import EntriesForm from './components/EntriesForm/EntriesForm';
import EntriesList from './components/EntriesList/EntriesList';
import EntriesContext from './entriesContext';
import Header from './components/Header/Header';
import { Box, Container } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyLists from './components/pages/MyLists';
function App() {
  const [entriesList, setEntriesList] = useState([]);
  console.log(entriesList);
  useEffect(() => {
    getEntries().then((data) =>
      // isEditing: false --> all entries start in view mode (not editable)
      setEntriesList(data.map((entry) => ({ ...entry, isEditing: false })))
    );
  }, []);

  return (
    <EntriesContext.Provider value={{ entriesList, setEntriesList }}>
      <Router>
        <Header />
        <Routes>
          <Route path='/my-lists' element={<MyLists />} />
          <Route
            path='/'
            element={
              <Container>
                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  justifyContent='center'
                  minHeight='100vh'
                  padding={2}
                >
                  <EntriesForm setEntriesList={setEntriesList} />
                  <EntriesList
                    entriesList={entriesList}
                    setEntriesList={setEntriesList}
                  />
                </Box>
              </Container>
            }
          />
        </Routes>
      </Router>
    </EntriesContext.Provider>
  );
}

export default App;
