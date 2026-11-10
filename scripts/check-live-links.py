#!/usr/bin/env python3
"""Crawl a live site from its home page; check internal pages, assets, and external links. Exit 1 on any broken internal link/asset."""
import sys, re, urllib.request, urllib.parse, ssl
from html.parser import HTMLParser
base = sys.argv[1].rstrip('/') + '/'
check_ext = '--external' in sys.argv
host = urllib.parse.urlparse(base).netloc
UA = {'User-Agent': 'Mozilla/5.0 (linkcheck)'}
class P(HTMLParser):
    def __init__(s): super().__init__(); s.links=[]; s.assets=[]
    def handle_starttag(s, t, a):
        a = dict(a)
        if t == 'a' and a.get('href'): s.links.append(a['href'])
        if t in ('img','script','source') and a.get('src'): s.assets.append(a['src'])
        if t == 'link' and a.get('href') and a.get('rel') in ('stylesheet','icon','preload'): s.assets.append(a['href'])
def fetch(u, method='GET'):
    u = urllib.parse.quote(u, safe=':/?&=%#+,;@~!$*()')
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers=UA, method=method), timeout=20)
        return r.status, r.read() if method == 'GET' else b'', r.geturl()
    except urllib.error.HTTPError as e:
        if method == 'HEAD' and e.code in (403, 405): return fetch(u, 'GET')
        return e.code, b'', u
    except Exception as e:
        return str(e)[:60], b'', u
seen, queue, bad, ext, assets = set(), [base], [], {}, {}
while queue:
    u = queue.pop()
    if u in seen: continue
    seen.add(u)
    st, body, final = fetch(u)
    if st != 200: bad.append((st, u, 'page')); continue
    if urllib.parse.urlparse(final).netloc != host: continue
    p = P(); p.feed(body.decode('utf-8', 'replace'))
    for a in p.assets:
        assets.setdefault(urllib.parse.urljoin(final, a), u)
    for h in p.links:
        if h.startswith(('mailto:', 'tel:', 'javascript:', '#')): continue
        full = urllib.parse.urljoin(final, h).split('#')[0]
        if urllib.parse.urlparse(full).netloc == host:
            if not re.search(r'\.(pdf|png|jpe?g|svg|zip|mp4|webp|gif|ico|xml|txt)$', full, re.I): queue.append(full)
            else: assets.setdefault(full, u)
        else: ext.setdefault(full, u)
for a, src in assets.items():
    if urllib.parse.urlparse(a).netloc != host: continue
    st, _, _ = fetch(a, 'HEAD')
    if st != 200: bad.append((st, a, 'asset on ' + src))
print(f'pages={len(seen)} internal_assets={sum(1 for a in assets if urllib.parse.urlparse(a).netloc==host)} external_links={len(ext)}')
ext_bad = []
if check_ext:
    for e, src in ext.items():
        st, _, _ = fetch(e, 'HEAD')
        if st not in (200, 999, 429) and not (isinstance(st, int) and 300 <= st < 400): ext_bad.append((st, e, src))
for b in bad: print('BROKEN', *b)
for b in ext_bad: print('EXTERNAL-WARN', *b)
print('PAGES:', *sorted(seen), sep='\n  ')
sys.exit(1 if bad else 0)
