import getRangeData from "@/lib/getRangeData";
import Range from "@/ui/Range";

export const dynamic = "force-dynamic";

export default async function Exercise2Page() {
  const data = await getRangeData("/exercise-2");

  return (
    <>
      <div style={{ width: "100%" }}>
        <Range
          min={data.rangeValues.at(0)}
          max={data.rangeValues.at(-1)}
          marks={data.rangeValues}
          value={{
            min: data.rangeValues.at(0),
            max: data.rangeValues.at(-1),
          }}
        />
      </div>
      ;<pre>{JSON.stringify(data, null, 2)}</pre>;
    </>
  );
}
