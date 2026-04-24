/**
 * Aggressively cleans CMS-provided HTML.
 * 1. Strips all <span> and </span> tags.
 * 2. Removes all 'style' attributes to clear inline colors/fonts.
 * 3. Removes all 'class' attributes to ensure our own UI styles take priority.
 */
export function cleanHtml(html: string): string {
  if (!html) return "";
  
  return html
    // Remove span tags entirely but keep the text inside
    .replace(/<\/?span[^>]*>/gi, "")
    // Remove all style="..." attributes
    .replace(/\sstyle="[^"]*"/gi, "")
    // Remove all class="..." attributes
    .replace(/\sclass="[^"]*"/gi, "");
}
