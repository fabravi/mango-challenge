import Exercise2 from "@/components/Exercise2";
import getRangeData from "@/lib/getRangeData";
import { FixedRange } from "@/types/FixedRange";

export const dynamic = "force-dynamic";

export default async function Exercise2Page() {
  const data = await getRangeData<FixedRange>("/exercise-2");

  return (
    <>
      <Exercise2 marks={data.rangeValues} />
    </>
  );
}
