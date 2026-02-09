// controllers/resource.controller.js
import Resource from "../models/Resource.js";

export const getResources = async (req, res) => {
  const resources = await Resource.find().sort({ updatedAt: -1 });
  res.json(resources);
};

export const createResource = async (req, res) => {
  const resource = await Resource.create(req.body);
  res.status(201).json(resource);
};

export const updateStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  const resource = await Resource.findById(id);
  if (!resource) return res.status(404).json({ message: "Not found" });

  resource.stock = stock;
  resource.status = stock < 100 ? "Low Stock" : "Available";
  await resource.save();

  res.json(resource);
};
