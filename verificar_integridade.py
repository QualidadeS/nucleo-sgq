from pathlib import Path
import hashlib, json, sys

root=Path(__file__).resolve().parent
cfg=json.loads((root/"MODULE_LOCKS.json").read_text(encoding="utf-8"))
bad=[]
for rel,expected in cfg["files"].items():
    p=root/rel
    if not p.exists():
        bad.append("FALTANDO: "+rel)
        continue
    actual=hashlib.sha256(p.read_bytes()).hexdigest()
    if actual!=expected:
        bad.append("ALTERADO: "+rel)

if bad:
    print("\n".join(bad))
    sys.exit(1)

print("OK — pacote coincide com o baseline modular consolidado.")
