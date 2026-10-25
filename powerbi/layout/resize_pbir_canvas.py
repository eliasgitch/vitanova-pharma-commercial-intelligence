#!/usr/bin/env python3
"""Adjust an EXISTING PBIR/PBIP report to a 27-inch-friendly Fit-to-page canvas.

Does NOT generate a PBIP or Power BI visuals. For each page.json, updates the page
canvas and, when requested, scales visual positions to keep them on-page. The
original JSON files are backed up as .bak by default on --apply.

Example:
  python powerbi/layout/resize_pbir_canvas.py --report path/to/Name.Report
  python powerbi/layout/resize_pbir_canvas.py --report path/to/Name.Report --apply
"""
from pathlib import Path
import argparse,json,sys

def report_pages(path):
    path=Path(path)
    if not path.exists(): raise FileNotFoundError(path)
    candidates=[path/'definition'/'pages',path/'pages',path]
    candidates += list(path.glob('**/definition/pages'))
    for c in candidates:
        if c.is_dir() and list(c.glob('*/page.json')):return c
    raise ValueError('No PBIR definition/pages/*/page.json found. A native PBIP is required.')

def plan(path,width=1600,height=820,apply=False):
    pages=report_pages(path)
    touched=[]
    for p in sorted(pages.glob('*/page.json')):
        obj=json.loads(p.read_text(encoding='utf-8-sig'))
        oldw=float(obj['width']);oldh=float(obj['height']);sx=width/oldw;sy=height/oldh
        changes=[]
        obj.update(width=width,height=height,displayOption='FitToPage')
        changes.append((p,obj))
        for vf in sorted((p.parent/'visuals').glob('*/visual.json')):
            v=json.loads(vf.read_text(encoding='utf-8-sig'))
            pos=v.get('position')
            if not pos:continue
            for k,scale in [('x',sx),('width',sx),('y',sy),('height',sy)]:
                if isinstance(pos.get(k),(int,float)):pos[k]=round(pos[k]*scale,3)
            changes.append((vf,v))
        if apply:
            for fp,ob in changes:
                Path(str(fp)+'.bak').write_bytes(fp.read_bytes())
                fp.write_text(json.dumps(ob,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        touched.append({'page':obj.get('displayName',p.parent.name),'old':[oldw,oldh],
                        'new':[width,height],'scaled_visuals':len(changes)-1})
    return touched

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report',required=True,help='Existing PBIP .Report folder or PBIR definition folder')
    parser.add_argument('--width',type=int,default=1600)
    parser.add_argument('--height',type=int,default=820)
    parser.add_argument('--apply',action='store_true',help='Apply changes with .bak backups (default: dry-run)')
    args=parser.parse_args()
    if args.width<=0 or args.height<=0:parser.error('width and height must be positive')
    try:
        changes=plan(args.report,args.width,args.height,args.apply)
    except (FileNotFoundError,ValueError,KeyError) as e:
        parser.exit(2,f'ERROR: {e}\n')
    for c in changes:print(f"{c['page']}: {c['old']} -> {c['new']} | {c['scaled_visuals']} visuals")
    print('UPDATED with .bak backups' if args.apply else 'DRY RUN only. Pass --apply to write changes.')

if __name__=='__main__':main()
