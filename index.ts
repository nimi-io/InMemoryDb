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

  class inMemoryDatabase<T extends BaseRecord> implements Database<T> {
    private db: Record<string, T> = {};

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }

    public get(id: string): T {
      return this.db[id];
    }
  }

const pokemonDB = new inMemoryDatabase<pokemon>();
pokemonDB.set({ id: "Bulbasaur", attack: 50, defense: 10 });
pokemonDB.set({ id: "BigBulba", attack: 100, defense: 200 });

console.log(pokemonDB.get("Bulbasaur"));
console.log(pokemonDB.get("BigBulba"));
console.log(pokemonDB);
