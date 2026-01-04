import { useState, useEffect } from "react";

const STORAGE_KEY = "today-eat-app-dishes";
const WEEK_KEY = "today-eat-app-week";
const defaultDishes = [
  { id: 1, name: "番茄炒蛋", category: "荤菜", time: 15, ingredients: ["鸡蛋", "番茄"] },
  { id: 2, name: "红烧鸡腿", category: "荤菜", time: 40, ingredients: ["鸡腿"] },
  { id: 3, name: "蒜蓉西兰花", category: "素菜", time: 10, ingredients: ["西兰花", "大蒜"] },
  { id: 4, name: "清炒菠菜", category: "素菜", time: 10, ingredients: ["菠菜"] }
];
const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default function App() {
  const [dishes, setDishes] = useState([]);
  const [weekMenu, setWeekMenu] = useState([]);

  useEffect(() => {
    const savedDishes = localStorage.getItem(STORAGE_KEY);
    setDishes(savedDishes ? JSON.parse(savedDishes) : defaultDishes);

    const savedWeek = localStorage.getItem(WEEK_KEY);
    if (savedWeek) setWeekMenu(JSON.parse(savedWeek));
  }, []);

  useEffect(() => { if (dishes.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes)); }, [dishes]);
  useEffect(() => { if (weekMenu.length) localStorage.setItem(WEEK_KEY, JSON.stringify(weekMenu)); }, [weekMenu]);

  function generateDay() {
    const meat = dishes.filter(d => d.category === "荤菜");
    const veg = dishes.filter(d => d.category === "素菜");
    if (!meat.length || !veg.length) return null;
    return { meat: meat[Math.floor(Math.random() * meat.length)], veg: veg[Math.floor(Math.random() * veg.length)] };
  }

  function generateWeek() {
    const week = days.map(day => ({ day, ...generateDay() }));
    setWeekMenu(week);
  }

  const shoppingList = Array.from(new Set(weekMenu.flatMap(d => [...(d.meat?.ingredients||[]), ...(d.veg?.ingredients||[])])));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">🍽 今天吃随便</h1>
      <p className="text-sm text-gray-600 mb-4">一周都不用想</p>

      <button onClick={generateWeek} className="w-full bg-black text-white py-4 rounded-2xl mb-6 text-lg">帮我安排一周吃什么</button>

      {weekMenu.length>0 && <div className="space-y-3 mb-6">{weekMenu.map((d,i)=>(<div key={i} className="bg-white rounded-xl p-3 shadow text-sm"><strong>{d.day}</strong><div>🥩 {d.meat?.name}</div><div>🥬 {d.veg?.name}</div></div>))}</div>}

      {shoppingList.length>0 && <div className="bg-white rounded-2xl p-4 shadow"><h2 className="font-semibold mb-2">🛒 本周购物清单</h2><ul className="text-sm list-disc pl-5">{shoppingList.map((item,i)=><li key={i}>{item}</li>)}</ul></div>}
    </div>
  );
}
