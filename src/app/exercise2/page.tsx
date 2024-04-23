import getRangeData from "@/lib/getRangeData";

export const dynamic = "force-dynamic";

export default async function Exercise2Page() {
  const data = await getRangeData("/exercise-2");

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
