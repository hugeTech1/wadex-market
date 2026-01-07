import { getQueryData } from "../services/page.service";

// utils/fetchBlockData.ts
export async function fetchBlockData(type: string) {
  const res = await getQueryData(
    "1b01309f-dbed-4ea0-8acf-b89ff81ccdb5",
    { type }
  );
  return res.data;
}
