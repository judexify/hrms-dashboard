import supabase from "./supabase";

const fetchData = async (table) => {
  const { data, error } = await supabase.from(table).select();
  if (error) throw new Error(error.message);
  return data;
};

export default fetchData;
