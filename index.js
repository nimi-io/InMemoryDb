"use strict";
function createObserver() {
    let listeners = [];
    return {
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter((l) => l === listener);
            };
        },
        publish: (event) => {
            listeners.forEach((l) => l(event));
        },
    };
}
function createDatabase() {
    class inMemoryDatabase {
        constructor() {
            this.db = {};
            this.beforeAddListeners = createObserver();
            this.afterAddListeners = createObserver();
        }
        set(newValue) {
            this.beforeAddListeners.publish({
                newValue,
                value: this.db[newValue.id],
            });
            this.db[newValue.id] = newValue;
            this.afterAddListeners.publish({ value: newValue });
        }
        get(id) {
            return this.db[id];
        }
        onBeforeAdd(listener) {
            return this.beforeAddListeners.subscribe(listener);
        }
        onAfterAdd(listener) {
            return this.afterAddListeners.subscribe(listener);
        }
        ////////////////////////////////////////////////////////////////
        visit(visitor) {
            Object.values(this.db).forEach(visitor);
        }
        ////strategy
        selectBest(scoreStrategy) {
            const found = {
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
    inMemoryDatabase.instance = new inMemoryDatabase();
    // const db = new inMemoryDatabase();
    return inMemoryDatabase;
}
const PokemonDB = createDatabase();
const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) => {
    console.log(value);
});
PokemonDB.instance.set({ id: "Bulbasaur", attack: 50, defense: 10 });
// unsubscribe();
PokemonDB.instance.set({ id: "BigBulba", attack: 100, defense: 200 });
PokemonDB.instance.visit((item) => console.log(item.id));
const bestDefence = PokemonDB.instance.selectBest(({ defence }) => defence);
console.log(bestDefence === null || bestDefence === void 0 ? void 0 : bestDefence.id);
// console.log(PokemonDB.instance.get("Bulbasaur"));
// console.log(PokemonDB.instance.get("BigBulba"));
// console.log(pokemonDB.instance);
