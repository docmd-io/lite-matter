// lite-matter test suite: extraction, failsafes on invalid YAML, CRLF, brute fuzz.
// Uses Node's built-in test runner (zero dependencies). Run: npm test
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { matter } from '../dist/index.js';

describe('matter() standard extraction', () => {
  it('parses frontmatter and returns content', () => {
    const src = '---\ntitle: Hello\ndate: 2026-01-01\n---\n# Body';
    const r = matter(src);
    assert.equal(r.data.title, 'Hello');
    assert.equal(r.content.trim(), '# Body');
  });

  it('returns the source unchanged when no frontmatter present', () => {
    const src = '# just body';
    const r = matter(src);
    assert.deepEqual(r.data, {});
    assert.equal(r.content, src);
  });

  it('returns empty data when frontmatter block is empty', () => {
    const r = matter('---\n---\nbody');
    assert.deepEqual(r.data, {});
  });

  it('handles nested objects in YAML', () => {
    const r = matter('---\nmeta:\n  a: 1\n  b: 2\n---\n');
    assert.equal(r.data.meta.a, 1);
    assert.equal(r.data.meta.b, 2);
  });

  it('handles arrays', () => {
    const r = matter('---\ntags:\n  - x\n  - y\n---\n');
    assert.deepEqual(r.data.tags, ['x', 'y']);
  });
});

describe('CRLF support', () => {
  it('parses frontmatter with Windows line endings', () => {
    const src = '---\r\ntitle: Hi\r\n---\r\n# Body';
    const r = matter(src);
    assert.equal(r.data.title, 'Hi');
    assert.ok(r.content.includes('# Body'));
  });
});

describe('failsafes (invalid YAML must not throw)', () => {
  it('returns empty data on malformed YAML', () => {
    // Unbalanced bracket / tab indent would normally throw in strict yaml.
    const r = matter('---\n: : :\nbad: [unclosed\n---\nbody');
    assert.deepEqual(r.data, {});
    assert.ok(r.content.includes('body'));
  });

  it('does not throw on YAML bombs / anchors', () => {
    // yaml lib has its own DoS guards; we just verify we do not throw.
    assert.doesNotThrow(() => matter('---\na: &a\n  b: *a\n---\nx'));
  });

  it('does not throw on extremely deep nesting', () => {
    let deep = '---\n';
    for (let i = 0; i < 200; i++) deep += '  '.repeat(i) + `k${i}:\n`;
    deep += '---\nbody';
    assert.doesNotThrow(() => matter(deep));
  });
});

describe('content passthrough (no mutation)', () => {
  it('preserves body exactly when frontmatter is well-formed', () => {
    const body = 'line1\n\nline2 with **markdown** and `code`\n';
    const r = matter(`---\nt: 1\n---\n${body}`);
    assert.equal(r.content, body);
  });

  it('does not strip a mid-document --- separator', () => {
    const src = '# H\n\n---\n\nmore';
    const r = matter(src);
    assert.equal(r.content, src);
  });
});

describe('brute fuzz: adversarial input never throws', () => {
  const poison = [
    '---\n---\n', '------\n', '---\n: : :\n---\n', '---\ntab:\there\n---\n',
    '---\n"unterminated\n---\n', '\x00\x01', '${x}', '', '\n\n\n',
    '---\r\n---\r\n', '---\r\n---\n', '---\n\n\n---\n',
    Buffer.from([0xff, 0xfe]).toString(), '---\n!!str 123\n---\n',
  ];
  let iterations = 0;
  for (let i = 0; i < 2000; i++) {
    const seed = poison[i % poison.length];
    const padding = 'x'.repeat(i % 100);
    const input = seed + padding + poison[(i * 7) % poison.length];
    assert.doesNotThrow(() => matter(input), `threw on iteration ${i}`);
    iterations++;
  }
  it(`ran ${iterations} fuzz iterations, 0 throws`, () => {
    assert.ok(iterations > 0);
  });
});
