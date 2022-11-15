import mongoose from "mongoose";

const mongoDBIP = process.env.MONGO_DB_IP || "mongodb://localhost";
const mongoDBPort = process.env.MONGO_DB_PORT || 27017;
const mongoDBData = process.env.MONGO_DB_DATA || 'project_store_2v';

const mongoURL = `${mongoDBIP}:${mongoDBPort}/${mongoDBData}`;

export const initDb = (callback) => {
  mongoose.connect(mongoURL)
    .then((client) => {
      callback(null, client);
    })
    .catch((err) => {
      callback(err);
    });
};
