const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const stringify = (value) => {
  return typeof value !== "string" ? JSON.stringify(value) : value
}

const createHash = (value) => {
  return crypto.createHash("sha3-512").update(stringify(value)).digest("hex")
}

const isNullOrUndefined = (value) => {
  return typeof value === "undefined" || value === null
}

exports.deterministicPartitionKey = (event) => {
  if (isNullOrUndefined(event)) {
    return TRIVIAL_PARTITION_KEY;
  }

  const candidate = event.partitionKey ? stringify(event.partitionKey) : createHash(event)

  return candidate.length > MAX_PARTITION_KEY_LENGTH ? createHash(candidate) : candidate
};