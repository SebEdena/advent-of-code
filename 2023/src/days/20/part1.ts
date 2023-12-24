import { readInput } from '@src/utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

interface Pulse {
  module: Module;
  input?: Module;
  value: boolean;
}

abstract class Module {
  children: Module[] = [];
  parents: Module[] = [];

  constructor(public id: string, public pulseLevel: boolean) {}

  abstract pulse(pulse: Pulse): Pulse[];

  addChild(child: Module): void {
    this.children.push(child);
    child.registerParent(this);
  }

  registerParent(parent: Module) {
    this.parents.push(parent);
  }
}

class SimpleModule extends Module {
  pulse({ value }: Pulse) {
    const nextPulses: Pulse[] = [];
    this.pulseLevel = value;
    for (const child of this.children) {
      nextPulses.push({ module: child, input: this, value: this.pulseLevel });
    }

    return nextPulses;
  }
}

class FlipFlopModule extends Module {
  private toggled = false;

  pulse({ value }: Pulse): Pulse[] {
    const nextPulses: Pulse[] = [];
    if (!value) {
      this.toggled = !this.toggled;
      this.pulseLevel = this.toggled;
      for (const child of this.children) {
        nextPulses.push({ module: child, input: this, value: this.pulseLevel });
      }
    } else {
      this.pulseLevel = true;
    }
    return nextPulses;
  }
}

class ConjunctionModule extends Module {
  private memory: Record<string, boolean> = {};

  pulse({ value, input }: Pulse) {
    this.memory[input!.id] = value;
    this.pulseLevel = !Object.values(this.memory).every((p) => p);
    const nextPulses: Pulse[] = [];
    for (const child of this.children) {
      nextPulses.push({ module: child, input: this, value: this.pulseLevel });
    }
    return nextPulses;
  }

  addChild(child: Module): void {
    super.addChild(child);
  }

  registerParent(parent: Module): void {
    super.registerParent(parent);
    this.memory[parent.id] = false;
  }
}

function parseInput(data: string[][]) {
  const moduleMap = new Map<string, Module>();

  const tmpMap = new Map<string, string[]>();
  for (const [info, , ...links] of data) {
    const [, type, id] = info.match(/(&|%){0,1}([a-z]+)/)!;
    let module: Module;
    switch (type) {
      case '%': {
        module = new FlipFlopModule(id, false);
        break;
      }
      case '&': {
        module = new ConjunctionModule(id, false);
        break;
      }
      default: {
        module = new SimpleModule(id, false);
        break;
      }
    }
    moduleMap.set(id, module);
    tmpMap.set(id, links ?? []);
  }

  for (const [id, links] of tmpMap.entries()) {
    const parent = moduleMap.get(id)!;
    for (const link of links.map((l) => l.replace(',', ''))) {
      let module = moduleMap.get(link);
      if (!module) {
        module = new SimpleModule(link, false);
        tmpMap.set(link, []);
        moduleMap.set(link, module);
      }
      parent.addChild(module);
    }
  }

  return moduleMap;
}

const moduleMap = parseInput(data);

let lowPulses = 0;
let highPulses = 0;

for (let i = 0; i < 1000; i++) {
  const operations: Pulse[] = [{ module: moduleMap.get('broadcaster')!, value: false }];
  while (operations.length > 0) {
    const operation = operations.shift()!;
    const { module } = operation;
    operation.value ? highPulses++ : lowPulses++;
    operations.push(...module.pulse(operation));
  }
}

console.log(lowPulses, highPulses, lowPulses * highPulses);
