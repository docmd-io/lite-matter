import { parse } from 'yaml';

export interface MatterResult {
  data: Record<string, any>;
  content: string;
}

/**
 * Extracts and parses YAML frontmatter from a string.
 * Mimics the API of `gray-matter` for easy drop-in replacement.
 */
export function matter(str: string): MatterResult {
  // Regex matches frontmatter bounded by --- only at the very start of the string
  const regex = /^(?:---[\r\n]+)([\s\S]*?)(?:[\r\n]+---(?:[\r\n]+|$))/;
  const match = str.match(regex);

  if (!match) {
    return { data: {}, content: str };
  }

  const yamlStr = match[1];
  const content = str.slice(match[0].length);

  try {
    const data = parse(yamlStr) || {};
    return { data, content };
  } catch (err) {
    // Return empty data but successfully parse the rest of the text if YAML fails
    return { data: {}, content: str };
  }
}

// Fallback default export for total compatibility
export default matter;
