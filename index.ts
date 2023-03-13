/////Observer
type Listener<EventType> = (ev: EventType) => void;

function createObserver<EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);

      return () => {
        listeners = listeners.filter((l) => l === listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event));
    },
  };
}

interface pokemon {
  id: string;
  attack: number;
  defense: number;
}
interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}
function createDatabase<T extends BaseRecord>() {
  class inMemoryDatabase<T extends BaseRecord> implements Database<T> {
    private db: Record<string, T> = {};

    static instance: inMemoryDatabase = new inMemoryDatabase();
    private constructor() {}

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }

    public get(id: string): T {
      return this.db[id];
    }
  }
  // const db = new inMemoryDatabase();
  return inMemoryDatabase;
}
const PokemonDB = createDatabase<pokemon>();

PokemonDB.instance.set({ id: "Bulbasaur", attack: 50, defense: 10 });
PokemonDB.instance.set({ id: "BigBulba", attack: 100, defense: 200 });

console.log(PokemonDB.instance.get("Bulbasaur"));
console.log(PokemonDB.instance.get("BigBulba"));
// console.log(pokemonDB.instance);
