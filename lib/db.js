import fs from 'fs';
import path from 'path';
import connectToDatabase from './mongodb';
import Applicant from '@/models/Applicant';

const DATA_FILE = path.join(process.cwd(), 'data', 'applicants.json');

// Ensure local fallback store directory exists
function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

function readLocalStore() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeLocalStore(data) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let isMongoAvailable = null;

async function checkMongo() {
  if (isMongoAvailable === false) return false;
  try {
    await connectToDatabase();
    isMongoAvailable = true;
    return true;
  } catch (err) {
    console.warn('[DB] MongoDB unavailable (falling back to local data/applicants.json store):', err.message);
    isMongoAvailable = false;
    return false;
  }
}

export const dbService = {
  async findByContact(contact) {
    const cleanContact = contact.trim().toLowerCase();
    const hasMongo = await checkMongo();
    if (hasMongo) {
      return await Applicant.findOne({ contact: cleanContact });
    }
    const list = readLocalStore();
    return list.find((a) => a.contact.toLowerCase() === cleanContact) || null;
  },

  async findById(id) {
    const hasMongo = await checkMongo();
    if (hasMongo) {
      return await Applicant.findById(id);
    }
    const list = readLocalStore();
    return list.find((a) => a._id === id || a.id === id) || null;
  },

  async create(data) {
    const hasMongo = await checkMongo();
    if (hasMongo) {
      return await Applicant.create(data);
    }
    const list = readLocalStore();
    const newDoc = {
      _id: 'cand_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newDoc);
    writeLocalStore(list);
    return newDoc;
  },

  async update(id, updates) {
    const hasMongo = await checkMongo();
    if (hasMongo) {
      const doc = await Applicant.findById(id);
      if (!doc) return null;
      Object.assign(doc, updates);
      await doc.save();
      return doc;
    }
    const list = readLocalStore();
    const index = list.findIndex((a) => a._id === id || a.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    writeLocalStore(list);
    return list[index];
  },

  async delete(id) {
    const hasMongo = await checkMongo();
    if (hasMongo) {
      const res = await Applicant.findByIdAndDelete(id);
      return !!res;
    }
    const list = readLocalStore();
    const index = list.findIndex((a) => a._id === id || a.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    writeLocalStore(list);
    return true;
  },

  async listAll() {
    const hasMongo = await checkMongo();
    if (hasMongo) {
      return await Applicant.find({}).sort({ appliedAt: -1, createdAt: -1 });
    }
    return readLocalStore();
  },
};
