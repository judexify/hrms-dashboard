import { useEffect, useState } from "react";
import fetchData from "../services/fetchEmployees";

const useFetch = (table) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData(table);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [table]);

  return { data, loading, error };
};

export default useFetch;
