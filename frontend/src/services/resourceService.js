import api from "./api";

export const fetchResources = async () => {
  const res = await api.get("/resources");
  return res.data;
};

export const createResource = async (data) => {
  const res = await api.post("/resources", data);
  return res.data;
};

export const updateResource = async (id, data) => {
  const res = await api.put(`/resources/${id}`, data);
  return res.data;
};

export const deleteResource = async (id) => {
  const res = await api.delete(`/resources/${id}`);
  return res.data;
};
