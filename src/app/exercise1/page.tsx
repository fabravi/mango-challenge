import getRangeData from "@/lib/getRangeData";

export const dynamic = "force-dynamic";

export default async function Exercise1Page() {
  const data = await getRangeData("/exercise-1");

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
