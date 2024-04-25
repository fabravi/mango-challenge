import Exercise1 from "@/components/Exercise1";
import getRangeData from "@/lib/getRangeData";
import { NormalRange } from "@/types/NormalRange";

export const dynamic = "force-dynamic";

export default async function Exercise1Page() {
  const data = await getRangeData<NormalRange>("/exercise-1");

  return (
    <>
      <Exercise1 min={data.min} max={data.max} />
    </>
  );
}
