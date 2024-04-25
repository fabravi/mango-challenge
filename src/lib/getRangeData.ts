const BASE_URL = process.env.API_BASE_URL;

export default async function getRangeData<T>(url: string): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
