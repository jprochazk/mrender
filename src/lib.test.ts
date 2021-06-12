
import { greet } from "./index";

describe("library", function () {
    it("Greets", function () {
        const expected = "Hello, World!";
        const actual = greet("World");
        expect(expected).toEqual(actual);
    });
})