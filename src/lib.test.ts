import { quat, vec3 } from "./math";

describe("Quaternion", function () {
  it("should calculate proper quaternion", function () {
    const actual = quat().rotationOf(vec3(0, 1, 0), vec3(1, 0, 0));
    const expected = quat(0, 0, -0.707106, 0.707106);
    expect(actual.x).toBeCloseTo(expected.x);
    expect(actual.y).toBeCloseTo(expected.y);
    expect(actual.z).toBeCloseTo(expected.z);
    expect(actual.w).toBeCloseTo(expected.w);
  });
});
