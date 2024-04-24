import getRangeData from "@/lib/getRangeData";
import Range from "@/ui/Range";

export const dynamic = "force-dynamic";

export default async function Exercise1Page() {
  const data = await getRangeData("/exercise-1");

  return (
    <>
      <div style={{ width: "100%" }}>
        <Range min={data.min} max={data.max} value={data} />
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
