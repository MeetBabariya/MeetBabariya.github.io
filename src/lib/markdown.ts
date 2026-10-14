/** Tiny, safe markdown for LLM answers: paragraphs, bullet lists, pipe tables, bold, code.
 *  All HTML in the input is escaped first. */
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');

export function md(src: string): string {
  const out: string[] = [];
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    if (l.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      i--;
      const [h, ...b] = rows;
      out.push(`<table><thead><tr>${h.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${b
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
    } else if (/^([-*]|\d+\.) /.test(l)) {
      const items: string[] = [];
      while (i < lines.length && /^([-*]|\d+\.) /.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^([-*]|\d+\.) /, ''));
      i--;
      out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`);
    } else {
      out.push(`<p>${inline(l.replace(/^#+\s*/, ''))}</p>`);
    }
  }
  return out.join('');
}

export const toolChip = (t: { name: string; input: Record<string, unknown> }) =>
  `<code class="chip">${esc(t.name)}(${esc(Object.entries(t.input ?? {}).map(([k, v]) => `${k}=${v}`).join(', '))})</code>`;
