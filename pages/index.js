import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [recipeName, setRecipeName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  const searchIngredients = async () => {
    if (query.length === 0) return setResults([]);
    const { data } = await supabase
      .from("ingredients")
      .select()
      .ilike("name", `%${query}%`);
    setResults(data || []);
  };

  useEffect(() => {
    const timeout = setTimeout(() => searchIngredients(), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const addIngredient = (item) => {
    if (!selected.find((i) => i.id === item.id)) {
      setSelected([...selected, item]);
    }
    setQuery("");
    setResults([]);
  };

  const createRecipe = async () => {
    const ids = selected.map((s) => s.id);
    await supabase.from("recipes").insert({ name: recipeName, ingredient_ids: ids });
    alert("Recipe saved!");
    setRecipeName("");
    setSelected([]);
  };

  const contains = [...new Set(selected.flatMap(i => i.allergens))];
  const mayContain = [...new Set(selected.flatMap(i => i.pal_allergens))]
    .filter(p => !contains.includes(p));

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Allergen Checker</h1>

      <input
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        placeholder="Recipe Name"
        className="w-full p-2 border rounded"
      />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search ingredients"
        className="w-full p-2 border rounded"
      />

      {results.length > 0 && (
        <ul className="border rounded max-h-40 overflow-auto">
          {results.map((item) => (
            <li
              key={item.id}
              onClick={() => addIngredient(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}

      <div>
        <p className="font-semibold">Ingredients:</p>
        <ul className="list-disc ml-5">
          {selected.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-semibold text-red-600">Contains:</p>
        <ul className="list-disc ml-5 text-red-600">
          {contains.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      <div>
        <p className="font-semibold text-yellow-600">May Contain:</p>
        <ul className="list-disc ml-5 text-yellow-600">
          {mayContain.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      <button
        onClick={createRecipe}
        disabled={!recipeName || selected.length === 0}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Recipe
      </button>
    </div>
  );
}