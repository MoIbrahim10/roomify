import { describe, expect, it } from "vitest";
import { createHostingSlug, getHostedUrl, getImageExtension, isHostedUrl } from "./utils";

describe("utils", () => {
  it("isHostedUrl detects puter.site hosts", () => {
    expect(isHostedUrl("https://foo.puter.site/x")).toBe(true);
    expect(isHostedUrl("https://example.com")).toBe(false);
    expect(isHostedUrl(1)).toBe(false);
  });

  it("getHostedUrl builds https URL", () => {
    expect(getHostedUrl({ subdomain: "abc" }, "projects/1/source.jpg")).toBe(
      "https://abc.puter.site/projects/1/source.jpg",
    );
  });

  it("getImageExtension prefers content type then path", () => {
    expect(getImageExtension("image/png", "")).toBe("png");
    expect(getImageExtension("", "https://x.com/a.JPG")).toBe("jpg");
  });

  it("createHostingSlug matches expected shape", () => {
    const slug = createHostingSlug();
    expect(slug).toMatch(/^roomify-[a-z0-9]+-[a-z0-9]+$/u);
  });
});
