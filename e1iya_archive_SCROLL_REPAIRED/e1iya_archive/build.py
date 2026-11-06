#!/usr/bin/env python3
"""Build browser-ready archive content from Markdown posts."""
from pathlib import Path
from urllib.parse import urlsplit
from html.parser import HTMLParser
import json
import re
import posixpath
import yaml
import mistune

root = Path(__file__).resolve().parent
posts = root / 'posts'
md = mistune.create_markdown(escape=True, plugins=['table', 'strikethrough', 'task_lists', 'url'])

class ImagePathRewriter(HTMLParser):
    def __init__(self, folder):
        super().__init__(convert_charrefs=False)
        self.folder = folder
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            attrs = [(k, self.resolve(v) if k == 'src' else v) for k, v in attrs]
        self.parts.append('<' + tag + ''.join(' ' + k + '="' + __import__('html').escape(v or '', quote=True) + '"' for k, v in attrs) + '>')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        self.parts.append('</' + tag + '>')

    def handle_data(self, data):
        self.parts.append(data)

    def handle_entityref(self, name):
        self.parts.append('&' + name + ';')

    def handle_charref(self, name):
        self.parts.append('&#' + name + ';')

    def resolve(self, src):
        if not src or src.startswith(('/', '#', 'data:')) or urlsplit(src).scheme:
            return src
        path, sep, suffix = src.partition('#')
        path, qsep, query = path.partition('?')
        # Markdown images are resolved relative to their .md file, not article.html.
        return posixpath.normpath('posts/' + self.folder + '/' + path) + (qsep + query if qsep else '') + (sep + suffix if sep else '')

records = []
for file in sorted(posts.rglob('*.md')):
    raw = file.read_text(encoding='utf-8-sig')
    match = re.match(r'\A---\s*\n(.*?)\n---\s*\n(.*)\Z', raw, re.S)
    if not match:
        raise ValueError(f'{file.relative_to(root)}: YAML frontmatter missing')
    meta = yaml.safe_load(match.group(1))
    if not isinstance(meta, dict):
        raise ValueError(f'{file}: frontmatter must be a YAML mapping')
    for key in ('id', 'title', 'date', 'category'):
        if not meta.get(key):
            raise ValueError(f'{file}: missing {key}')
    tags = meta.get('tags', [])
    if not isinstance(tags, list):
        raise ValueError(f'{file}: tags must be a list')
    category = str(meta['category']).strip('/')
    if not re.fullmatch(r'[\w/-]+', category) or '..' in category.split('/'):
        raise ValueError(f'{file}: invalid category')
    html = md(match.group(2))
    parser = ImagePathRewriter(file.relative_to(posts).parent.as_posix())
    parser.feed(html)
    records.append(dict(id=str(meta['id']), title=str(meta['title']),
        file=file.name, date=str(meta['date']), folder=category,
        tags=[str(t) for t in tags], featured=bool(meta.get('featured', False)),
        summary=str(meta.get('summary', '')), html=''.join(parser.parts)))
ids = [r['id'] for r in records]
if len(ids) != len(set(ids)):
    raise ValueError('Duplicate record IDs: ' + ', '.join(sorted({i for i in ids if ids.count(i)>1})))
# Escape script-breaking characters so content-data.js can safely embed post content.
serialized = json.dumps(records, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
(root/'content-data.js').write_text('window.ARCHIVE_RECORDS = ' + serialized + ';\n', encoding='utf-8')
(root/'records.json').write_text(json.dumps([{k:v for k,v in r.items() if k!='html'} for r in records], ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Built {len(records)} Markdown records')
