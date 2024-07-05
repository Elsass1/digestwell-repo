import React, { useContext } from 'react';
import HealthImpactTable from '../Table/HealthImpactTable';
import EntriesContext from '../../entriesContext';

const MyLists = () => {
  const { entriesList, setEntriesList } = useContext(EntriesContext);

  return (
    <div>
      <HealthImpactTable
        entriesList={entriesList}
        setEntriesList={setEntriesList}
      />
    </div>
  );
};

export default MyLists;
