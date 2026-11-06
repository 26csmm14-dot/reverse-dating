import fs from 'fs';
import path from 'path';
import os from 'os';
import mongoose from 'mongoose';
import connectToDatabase from './mongodb';
import Applicant from '@/models/Applicant';

// In serverless environments (Vercel/AWS Lambda), /var/task is read-only.
// Use os.tmpdir() (/tmp) which is always writable in serverless environments.
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_FILE = IS_SERVERLESS
  ? path.join(os.tmpdir(), 'applicants.json')
  : path.join(process.cwd(), 'data', 'applicants.json');

const MEMORY_STORE_KEY = '__reverseDatingLocalStore';

function getMemoryStore() {
  if (!globalThis[MEMORY_STORE_KEY]) {
    globalThis[MEMORY_STORE_KEY] = [];
  }
  return globalThis[MEMORY_STORE_KEY];
}

function syncMemoryStore(data) {
  const next = Array.isArray(data) ? data : [];
  globalThis[MEMORY_STORE_KEY] = next;
  return next;
}

function ensureDataDir() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
  } catch (err) {
    // Silently ignore filesystem errors; memory store will handle persistence
  }
}

function readLocalStore() {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return syncMemoryStore(parsed);
      }
    }
  } catch (err) {
    // Fall back to in-memory store
  }

  return getMemoryStore();
}

function writeLocalStore(data) {
  const next = Array.isArray(data) ? data : [];
  syncMemoryStore(next);

  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2));
  } catch (err) {
    // If filesystem is read-only, memory store holds state for current instance
  }
}

async function checkMongo() {
  try {
    await connectToDatabase();
    return true;
  } catch (err) {
    console.warn('[DB] MongoDB Atlas connection check failed, using fallback:', err.message);
    return false;
  }
}

export const dbService = {
  async findByContact(contact) {
    if (!contact) return null;
    const cleanContact = contact.trim().toLowerCase();
    const hasMongo = await checkMongo();
    if (hasMongo) {
      try {
        return await Applicant.findOne({ contact: cleanContact });
      } catch (e) {
        const coll = Applicant.collection;
        return await coll.findOne({ contact: cleanContact });
      }
    }
    const list = readLocalStore();
    return list.find((a) => a.contact?.toLowerCase() === cleanContact) || null;
  },

  async findById(id) {
    if (!id) return null;
    const cleanId = String(id).trim();
    const hasMongo = await checkMongo();
    if (hasMongo) {
      try {
        const coll = Applicant.collection;
        if (cleanId.length === 24 && /^[0-9a-fA-F]{24}$/.test(cleanId)) {
          const doc = await coll.findOne({ _id: new mongoose.Types.ObjectId(cleanId) });
          if (doc) return doc;
        }
        const doc = await coll.findOne({ $or: [{ _id: cleanId }, { contact: cleanId.toLowerCase() }] });
        if (doc) return doc;
      } catch (err) {
        console.warn('[DB] findById error:', err.message);
      }
    }
    const list = readLocalStore();
    return list.find((a) => a._id?.toString() === cleanId || a.id?.toString() === cleanId || a.contact?.toLowerCase() === cleanId.toLowerCase()) || null;
  },

  async create(data) {
    const hasMongo = await checkMongo();
    if (hasMongo) {
      try {
        return await Applicant.create(data);
      } catch (e) {
        console.warn('[DB] Applicant.create error, using fallback:', e.message);
      }
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
    if (!id) return null;
    const cleanId = String(id).trim();
    const hasMongo = await checkMongo();
    if (hasMongo) {
      try {
        const coll = Applicant.collection;
        let res = null;
        if (cleanId.length === 24 && /^[0-9a-fA-F]{24}$/.test(cleanId)) {
          res = await coll.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(cleanId) },
            { $set: updates },
            { returnDocument: 'after' }
          );
          if (res) return res.value || res;
        }
        res = await coll.findOneAndUpdate(
          { $or: [{ _id: cleanId }, { contact: cleanId.toLowerCase() }] },
          { $set: updates },
          { returnDocument: 'after' }
        );
        if (res) return res.value || res;
      } catch (err) {
        console.warn('[DB] update error:', err.message);
      }
    }
    const list = readLocalStore();
    const index = list.findIndex((a) => a._id?.toString() === cleanId || a.id?.toString() === cleanId || a.contact?.toLowerCase() === cleanId.toLowerCase());
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    writeLocalStore(list);
    return list[index];
  },

  async delete(id) {
    if (!id) return false;
    const cleanId = String(id).trim();
    const hasMongo = await checkMongo();
    if (hasMongo) {
      try {
        const coll = Applicant.collection;
        if (cleanId.length === 24 && /^[0-9a-fA-F]{24}$/.test(cleanId)) {
          await coll.deleteOne({ _id: new mongoose.Types.ObjectId(cleanId) });
          return true;
        }
        await coll.deleteOne({ $or: [{ _id: cleanId }, { contact: cleanId.toLowerCase() }] });
        return true;
      } catch (e) {}
    }
    const list = readLocalStore();
    const index = list.findIndex((a) => a._id?.toString() === cleanId || a.id?.toString() === cleanId);
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
