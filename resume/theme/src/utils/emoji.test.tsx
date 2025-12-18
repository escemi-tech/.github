import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { renderEmojiText } from "./emoji";

const render = (value: string) =>
  renderToStaticMarkup(<span>{renderEmojiText(value)}</span>);

describe("renderEmojiText", () => {
  it("returns the original string when no emoji token is present", () => {
    expect(renderEmojiText("Hello world")).toBe("Hello world");
  });

  it("replaces supported emoji tokens with Twemoji img tags", () => {
    const html = render("💼 Work");

    expect(html).toContain("<img");
    expect(html).toContain('class="emoji"');
    expect(html).toContain("/1f4bc.svg");
    expect(html).toContain("Work");
  });

  it("normalizes VS16 so ⚙ and ⚙️ map to the same asset", () => {
    const htmlPlain = render("⚙ Skills");
    const htmlVs16 = render("⚙️ Skills");

    expect(htmlPlain).toContain("/2699.svg");
    expect(htmlVs16).toContain("/2699.svg");
  });

  it("does not throw on empty strings", () => {
    expect(renderEmojiText("")).toBe("");
  });
});
