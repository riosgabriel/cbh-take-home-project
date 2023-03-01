const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  const maxLengthKey = crypto.randomBytes(128).toString('hex');

  test.each([
    { expected: "0"},
    { event: null, expected: "0"},
    { event: undefined, expected: "0"},
    { event: [], expected: "888b858b73d5d34fedab0f07663436931a95c73d6d7808edc868767bb9172f9e542fb7bb1ad1dbe988ceff0aaffde2012bc0e7d1914e986269f46d93651436a5"},
    { event: {}, expected: "c1802e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862"},
    { event: { partitionKey: "foo" }, expected: "foo"},
    { event: { partitionKey: 1}, expected: "1"},
    { event: { partitionKey: {} }, expected: "{}"},
    { event: { partitionKey: [] }, expected: "[]"},
    { event: { partitionKey: "1" }, expected: "1"},
    { event: { partitionKey: true }, expected: "true"},
    // Test for Falsy values
    { event: { partitionKey: false }, expected: "51a5f43b933ce152103a4789a17f1cf958e0b5e1c793082db6a6c74dd3f04c69ad8f558e28cf7c3eac61af4e484741f095129e815c4de4fdd30e3cd6c4e3c00f"},
    { event: { partitionKey: 0}, expected: "e65a0cb83a95cae7eb0642da576cac881e397c0405c63577c977068f7892f69f1c315baa294124da2a67e0c486d340f9d357377f894d0c0fd850484f8984f2e7"},
    { event: { partitionKey: null }, expected: "58540d4d440df8c6c6da0d79cfce715bc92953c6cde8be9f749790004ef2d5a7322d0fd5170eac9a37d57ee0cc975cfca068a60b01622529d9e0fd657f71b8e2"},
    { event: { partitionKey: "" }, expected: "b7478342a465088fc33d43a64cd370737e5a3bf6749ca62c1d6db341beb987326b4df3a9f54f67a2f0ee915d4216af2f382fda14dd58dc67794f745e92d7a7f6"},
    { event: { a: 1 }, expected: "c9a6cb6de7eade2b826bdf037b53d731787039c07a68060d340e805d65eb181cdb8f8ff65c3b1196a4f6019f35f4527e5a4c409f62c7d371cb13eb7b7b50b3c3"},
    { event: { partitionKey: maxLengthKey }, expected: maxLengthKey },
  ])("provided partition key should return expected value", ({event, expected}) => {
    expect(deterministicPartitionKey(event)).toBe(expected);
  });
  
  it("a partition key length provided is greater than 256 than hash it", () => {
    const maxLengthKey = crypto.randomBytes(128).toString('hex') + "foo";
    const result = deterministicPartitionKey(maxLengthKey);
    expect(result).not.toBe(maxLengthKey)
    expect(result.length).toBeLessThanOrEqual(256)
  });
});
