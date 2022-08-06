import { quickInfoToHTML } from "./index";

it("render some examples", async () => {
  const examples = [
    "function compact(arr: string[]): string[]",
    "(parameter) arr: string[]",
    "(parameter) arr: string[]",
    "(property) Array<string>.length: number",
  ];

  expect(quickInfoToHTML(examples[0])).toMatchInlineSnapshot(`
    [
      {
        "token": 0,
      },
      {
        "text": "compact",
        "token": 6,
      },
      {
        "token": 11,
      },
      {
        "text": "arr",
        "token": 6,
      },
      {
        "token": 9,
      },
      {
        "text": "string",
        "token": 6,
      },
      {
        "token": 11,
      },
      {
        "token": 11,
      },
      {
        "token": 11,
      },
      {
        "token": 9,
      },
      {
        "text": "string",
        "token": 6,
      },
      {
        "token": 11,
      },
      {
        "token": 11,
      },
    ]
  `);
});
