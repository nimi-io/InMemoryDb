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

interface beforSetEvent<T> {
  value: T;
  newalue: T;
}

interface afterSetEvent<T> {
  value: T;
}

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;

  onBeforeAdd(listener: Listener<beforSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<afterSetEvent<T>>): () => void;

  visit(visitor: (item: T) => void): void;
}
function createDatabase<T extends BaseRecord>() {
  class inMemoryDatabase<T extends BaseRecord> implements Database<T> {
    private db: Record<string, T> = {};

    static instance: inMemoryDatabase = new inMemoryDatabase();

    private beforeAddListeners = createObserver<beforSetEvent<T>>();
    private afterAddListeners = createObserver<afterSetEvent<T>>();

    private constructor() {}

    public set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue,
        value: this.db[newValue.id],
      });
      this.db[newValue.id] = newValue;

      this.afterAddListeners.publish({ value: newValue });
    }

    public get(id: string): T {
      return this.db[id];
    }

    onBeforeAdd(listener: Listener<beforSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener);
    }
    onAfterAdd(listener: Listener<afterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }

    ////////////////////////////////////////////////////////////////
    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    ////strategy

    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined;
      } = {
        max: 0,
        item: undefined,
      };
      Object.values(this.db).reduce((f, item) => {
        const score = scoreStrategy(item);
        if (score > f.max) {
          f.max = score;
          f.item = item;
        }
        return f;
      }, found);

      return found.item;
    }
  }
  // const db = new inMemoryDatabase();
  return inMemoryDatabase;
}
const PokemonDB = createDatabase<pokemon>();
const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) => {
  console.log(value);
});

PokemonDB.instance.set({ id: "Bulbasaur", attack: 50, defense: 10 });
// unsubscribe();

PokemonDB.instance.set({ id: "BigBulba", attack: 100, defense: 200 });
PokemonDB.instance.visit((item: { id: any }) => console.log(item.id));
const bestDefence = PokemonDB.instance.selectBest(({ defence }) => defence);
console.log(bestDefence?.id);
// console.log(PokemonDB.instance.get("Bulbasaur"));

// console.log(PokemonDB.instance.get("BigBulba"));
// console.log(pokemonDB.instance);
