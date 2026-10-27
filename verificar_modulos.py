from pathlib import Path
import hashlib, json, sys

root=Path(__file__).resolve().parent
cfg=json.loads((root/'MODULE_LOCKS.json').read_text(encoding='utf-8'))
problems=[]
for rel,expected in cfg['files'].items():
    p=root/rel
    if not p.exists():
        problems.append(f'FALTANDO: {rel}')
        continue
    actual=hashlib.sha256(p.read_bytes()).hexdigest()
    if actual!=expected:
        problems.append(f'ALTERADO: {rel}')
if problems:
    print('\n'.join(problems))
    sys.exit(1)
print('OK — arquivos protegidos coincidem com o baseline.')
