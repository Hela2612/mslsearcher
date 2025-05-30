import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const highlightColor = (value: string) => {
  if (value === "Y") return "text-green-600";
  if (value === "N") return "text-red-600";
  return "text-gray-400";
};

export default function MSLSearchApp() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxINi1AxLyFY5lZ8SinyvzN--i81Jpcjvg2bRMZJxMkcI7MOYLWlCTuaaBLE8LAnFkHag/exec")
      .then((res) => res.json())
      .then((json) => {
        const headers = json.values[0];
        const rows = json.values.slice(1);
        const mapped = rows.map((row: string[]) => {
          const entry: any = {};
          headers.forEach((h, i: number) => {
            entry[h] = row[i] || "";
          });
          return entry;
        });
        setData(mapped);
      });
  }, []);

  const results = data.filter((item) => {
    const searchCols = Object.keys(item).slice(0, 8);
    return searchCols.some((key) =>
      item[key]?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-4">
      <Input
        placeholder="Search by city, street or ERC..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {!selected && (
        <div className="grid gap-2">
          {results.slice(0, 15).map((item, index) => (
            <Card key={index} onClick={() => setSelected(item)} className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-4">
                <div className="font-semibold">{item.LocName}</div>
                <div className="text-sm text-gray-500">{item.LocStreet}, {item.LocCity}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div>
          <button onClick={() => setSelected(null)} className="mb-4 text-blue-600 underline">
            ← Back to search results
          </button>

          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              <TabsTrigger value="tab4">Tab 4</TabsTrigger>
              <TabsTrigger value="tab5">Tab 5</TabsTrigger>
            </TabsList>
            {[1, 2, 3, 4, 5].map((tab) => (
              <TabsContent value={`tab${tab}`} key={tab}>
                <div className="p-4 grid gap-2">
                  {Object.entries(selected).map(([key, value]) => {
                    if (key.startsWith(`Tab${tab}_`)) {
                      const className = highlightColor(selected[`Highlight_${key}`]);
                      return (
                        <div key={key} className={className}>
                          <strong>{key.replace(`Tab${tab}_`, "")}:</strong> {value}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}
