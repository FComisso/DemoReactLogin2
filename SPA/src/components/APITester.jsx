import React, { useState, useEffect } from 'react';

import { useMsal } from "@azure/msal-react";
import { nanoid } from "nanoid";

import useFetchWithMsal from '../hooks/useFetchWithMsal';
import { protectedResources } from "../authConfig";

const APITester = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { error2, execute } = useFetchWithMsal({
    scopes: protectedResources.apiTodoList.scopes.write
  });

  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  const fetchData = async () => {
    setLoading(true);
    try {
      const newTask = {
        owner: account.idTokenClaims?.oid,
        id: nanoid(),
        completed: false
      };
      execute("POST", protectedResources.apiTodoList.endpoint, newTask)
        .then(async (response) => {

          //const response = await fetch(protectedResources.apiTodoList.endpoint);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const responseData = await response.json();
          setData(responseData);
        })
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <div>Error: {error}</div>}
      {data && (
        <div>
          <h1>Data from API</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default APITester;