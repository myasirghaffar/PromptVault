const HOMEPAGE_KEYWORDS = [
  "prompt manager",
  "ai prompt manager",
  "ai prompt organizer",
  "reusable prompts system",
];

const BLOG_KEYWORDS = [
  "tutorial",
  "guide",
  "best practices",
  "prompt engineering tips",
];

const FEATURE_KEYWORDS = [
  "feature",
  "workflow",
  "team collaboration",
  "prompt library",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceFirstKeyword(
  text: string,
  keyword: string,
  href: string,
  anchorText?: string,
): string {
  const pattern = new RegExp(`\\b(${escapeRegExp(keyword)})\\b`, "i");
  if (!pattern.test(text)) return text;

  return text.replace(pattern, (match) => {
    const label = anchorText || match;
    return `<a href="${href}" class="text-purple-400 hover:text-purple-300 underline">${label}</a>`;
  });
}

export function autoInternalLinkHtmlContent(html: string): string {
  if (!html?.trim()) return html;

  const segments = html.split(/(<[^>]+>)/g);
  const keywordMap: Array<{ words: string[]; href: string }> = [
    { words: HOMEPAGE_KEYWORDS, href: "/" },
    { words: BLOG_KEYWORDS, href: "/blog" },
    { words: FEATURE_KEYWORDS, href: "/documentation" },
  ];

  let linkedContent = segments
    .map((segment) => {
      if (!segment || segment.startsWith("<")) return segment;

      let updated = segment;
      keywordMap.forEach(({ words, href }) => {
        words.forEach((keyword) => {
          updated = replaceFirstKeyword(updated, keyword, href);
        });
      });
      return updated;
    })
    .join("");

  // Safety cleanup to avoid nested anchors in rare generated content.
  linkedContent = linkedContent.replace(/<\/a>\s*<a [^>]+>/g, " ");
  return linkedContent;
}

export function autoInternalLinkTextContent(text: string): string {
  if (!text?.trim()) return text;

  let linked = text;
  HOMEPAGE_KEYWORDS.forEach((keyword) => {
    linked = replaceFirstKeyword(linked, keyword, "/");
  });
  BLOG_KEYWORDS.forEach((keyword) => {
    linked = replaceFirstKeyword(linked, keyword, "/blog");
  });
  FEATURE_KEYWORDS.forEach((keyword) => {
    linked = replaceFirstKeyword(linked, keyword, "/documentation");
  });

  return linked;
}

export function getDefaultInternalLinks() {
  return [
    { href: "/", label: "Prompt manager homepage" },
    { href: "/blog", label: "Prompt tutorials and guides" },
    { href: "/documentation", label: "Platform features and workflows" },
  ];
}
