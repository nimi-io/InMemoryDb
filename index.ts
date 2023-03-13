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

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }

    public get(id: string): T {
      return this.db[id];
    }
  }
  return inMemoryDatabase;
}
const pokemonDB = createDatabase<pokemon>();
const PokemonDB = new pokemonDB();

PokemonDB.set({ id: "Bulbasaur", attack: 50, defense: 10 });
PokemonDB.set({ id: "BigBulba", attack: 100, defense: 200 });


console.log(PokemonDB.get("Bulbasaur"));
console.log(PokemonDB.get("BigBulba"));
console.log(pokemonDB);
