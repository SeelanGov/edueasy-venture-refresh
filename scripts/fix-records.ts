import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
project.addSourceFilesAtPaths(['src/**/*.{ts,tsx}']);

let totalFixed = 0;

for (const sf of project.getSourceFiles()) {
  let touched = false;
  sf.forEachDescendant((node) => {
    // Record with no generic args
    if (
      node.getKind() === SyntaxKind.TypeReference &&
      (node as any).getTypeName?.().getText() === 'Record' &&
      !(node as any).getTypeArguments?.().length
    ) {
      (node as any).addTypeArgument('string');
      (node as any).addTypeArgument('unknown');
      touched = true;
      totalFixed++;
    }
  });
  if (touched) {
    sf.saveSync();
    console.log(`Fixed ${sf.getFilePath()}`);
  }
}

project.saveSync();
console.log(`✅ Fixed ${totalFixed} bare Record to Record<string, unknown>`);