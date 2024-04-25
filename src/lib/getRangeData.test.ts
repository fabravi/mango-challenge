import getRangeData from "./getRangeData";

const mockFetch = (resolveWith: any) => {
  // @ts-ignore
  global.fetch = jest.fn(() => Promise.resolve(resolveWith));
};

it("fetches the correct url", async () => {
  mockFetch({
    ok: true,
    json: () => Promise.resolve({ min: 1, max: 5 }),
  });

  const BASE_URL = "http://localhost:3000/api";
  const url = "/exercise-1";
  const data = await getRangeData(url);
  expect(data).toEqual({ min: 1, max: 5 });
  expect(fetch).toHaveBeenCalledWith(`${BASE_URL}${url}`, {
    cache: "no-store",
  });
});

it("fetches throws on error", async () => {
  mockFetch({
    ok: false,
  });

  const url = "/exercise-1";

  expect(async () => await getRangeData(url)).rejects.toThrow();
});
