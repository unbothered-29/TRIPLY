"use client";

import { useState, useEffect } from "react";
import { getSmartPackingItems, PackingItem } from "@/lib/packingData";
import { showToast } from "@/components/ui/Toast";

interface SmartPackingChecklistProps {
  destinationSlug: string;
  destinationName: string;
  temperature: string;
}

export default function SmartPackingChecklist({
  destinationSlug,
  destinationName,
  temperature,
}: SmartPackingChecklistProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "documents" | "clothing" | "gear" | "health">("all");
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<PackingItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<"documents" | "clothing" | "gear" | "health">("clothing");

  const storageKey = `triply_packing_${destinationSlug}`;
  const customItemsKey = `triply_custom_packing_${destinationSlug}`;

  const baseLists = getSmartPackingItems(destinationSlug, temperature);

  // Load from localStorage after mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedChecks = localStorage.getItem(storageKey);
      if (savedChecks) {
        setPackedItems(JSON.parse(savedChecks));
      }
      const savedCustom = localStorage.getItem(customItemsKey);
      if (savedCustom) {
        setCustomItems(JSON.parse(savedCustom));
      }
    } catch {
      // ignore
    }
  }, [storageKey, customItemsKey]);

  // Combine built-in items with user custom items
  const allItems: PackingItem[] = [
    ...baseLists.documents,
    ...baseLists.clothing,
    ...baseLists.gear,
    ...baseLists.health,
    ...customItems,
  ];

  const filteredItems =
    activeCategory === "all"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

  const packedCount = allItems.filter((i) => Boolean(packedItems[i.id])).length;
  const totalCount = allItems.length;
  const percent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggle = (id: string, name: string) => {
    setPackedItems((prev) => {
      const nextState = !prev[id];
      const updated = { ...prev, [id]: nextState };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (nextState) {
        showToast({
          title: "Packed!",
          description: `Checked off "${name}"`,
          type: "success",
        });
      }
      return updated;
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      name: newItemText.trim(),
      category: newItemCategory,
      essential: false,
    };

    const updatedCustom = [...customItems, newItem];
    setCustomItems(updatedCustom);
    setNewItemText("");

    try {
      localStorage.setItem(customItemsKey, JSON.stringify(updatedCustom));
      showToast({
        title: "Item Added",
        description: `Added "${newItem.name}" to packing list.`,
        type: "success",
      });
    } catch {
      // ignore
    }
  };

  const handleDeleteCustom = (id: string) => {
    const updatedCustom = customItems.filter((i) => i.id !== id);
    setCustomItems(updatedCustom);
    try {
      localStorage.setItem(customItemsKey, JSON.stringify(updatedCustom));
    } catch {
      // ignore
    }
  };

  const handleCheckAll = () => {
    const allChecked: Record<string, boolean> = {};
    allItems.forEach((i) => {
      allChecked[i.id] = true;
    });
    setPackedItems(allChecked);
    try {
      localStorage.setItem(storageKey, JSON.stringify(allChecked));
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setPackedItems({});
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    showToast({
      title: "Checklist Reset",
      description: "All packing items unchecked.",
      type: "neutral",
    });
  };

  const categoryIcons: Record<string, string> = {
    documents: "🧳",
    clothing: "👕",
    gear: "🔌",
    health: "💊",
  };

  return (
    <div className="rounded-[2.5rem] border border-white/15 bg-neutral-950/80 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] print:border-none print:p-0 print:bg-white print:text-black">
      {/* Header & Progress Stats */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-center print:border-gray-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">
              🎒
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50 print:text-gray-500">
              Smart Travel Readiness
            </p>
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-light text-white print:text-black">
            Packing Checklist for {destinationName}
          </h3>
          <p className="mt-1 text-xs text-white/50 print:text-gray-500">
            Tailored specifically for {temperature} climate, weather layers, and essential travel documents.
          </p>
        </div>

        {/* Progress Circular/Pill display */}
        <div className="flex flex-col items-start sm:items-end gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{packedCount} of {totalCount}</span>
            <span className="text-xs text-white/40">Packed ({percent}%)</span>
          </div>

          <div className="h-2 w-44 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={handleCheckAll}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 transition"
            >
              Check All
            </button>
            <span className="text-white/20 text-xs">•</span>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-white/40 hover:text-white transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
        {(
          [
            { id: "all", label: "All Items", icon: "📋" },
            { id: "documents", label: "Essentials & Docs", icon: "🧳" },
            { id: "clothing", label: "Clothing & Weather", icon: "👕" },
            { id: "gear", label: "Tech & Gear", icon: "🔌" },
            { id: "health", label: "Health & Comfort", icon: "💊" },
          ] as const
        ).map((tab) => {
          const active = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                active
                  ? "bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddCustom} className="mt-6 flex flex-col sm:flex-row gap-2.5 print:hidden">
        <input
          type="text"
          placeholder="Add custom packing item (e.g. Hiking pole, drone, journal)..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs text-white outline-none placeholder:text-white/30 focus:border-white/40 focus:bg-white/[0.07]"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as any)}
          className="rounded-2xl border border-white/15 bg-neutral-900 px-3 py-2.5 text-xs text-white outline-none"
        >
          <option value="clothing">👕 Clothing</option>
          <option value="documents">🧳 Documents</option>
          <option value="gear">🔌 Tech & Gear</option>
          <option value="health">💊 Health</option>
        </select>

        <button
          type="submit"
          className="rounded-2xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-md"
        >
          + Add Item
        </button>
      </form>

      {/* Items Grid */}
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {filteredItems.map((item) => {
          const isPacked = mounted && Boolean(packedItems[item.id]);
          const isCustom = item.id.startsWith("custom-");

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id, item.name)}
              className={`group flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer ${
                isPacked
                  ? "border-emerald-500/40 bg-emerald-950/20 text-white/50 print:border-gray-300"
                  : "border-white/10 bg-white/[0.02] text-white hover:border-white/25 hover:bg-white/[0.05] print:border-gray-200 print:text-black"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Custom Styled Checkbox */}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                    isPacked
                      ? "border-emerald-400 bg-emerald-400 text-black font-bold shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                      : "border-white/25 bg-white/5 group-hover:border-white/50"
                  }`}
                >
                  {isPacked && <span className="text-xs">✓</span>}
                </div>

                <div className="truncate">
                  <p
                    className={`text-xs font-medium transition-all truncate ${
                      isPacked ? "line-through text-white/40" : "text-white/90 print:text-black"
                    }`}
                  >
                    {item.name}
                  </p>
                  <span className="text-[10px] text-white/40">
                    {categoryIcons[item.category]} {item.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Badges / Delete Custom Item */}
              <div className="flex items-center gap-1.5 shrink-0">
                {item.essential && !isPacked && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-amber-300">
                    Essential
                  </span>
                )}

                {isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustom(item.id);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white/30 hover:bg-red-500/20 hover:text-red-300 transition"
                    title="Remove item"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
