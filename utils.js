import { stat } from "node:fs/promises";

export async function existsFile(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    return false;
  }
}
