export function generateImageAltText({
  title,
  context,
}: {
  title?: string | null;
  context?: string;
}): string {
  const normalizedTitle = title?.trim();
  const normalizedContext = context?.trim();

  if (normalizedTitle && normalizedContext) {
    return `${normalizedTitle} - ${normalizedContext}`;
  }

  if (normalizedTitle) {
    return `${normalizedTitle} illustration`;
  }

  if (normalizedContext) {
    return `${normalizedContext} illustration`;
  }

  return "PromptVault image";
}
