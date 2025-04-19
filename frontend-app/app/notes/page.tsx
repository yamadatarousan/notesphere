"use client";
import { useState } from "react";
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
}

const queryClient = new QueryClient();

function NotesPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => fetch("http://localhost:8000/api/notes").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: (newNote: { title: string; content: string; tags: string[] }) =>
      fetch("http://localhost:8000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      }).then((res) => res.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const handleSubmit = () => {
    mutation.mutate({ title, content, tags: tags.split(",").map((t) => t.trim()) });
    setTitle("");
    setContent("");
    setTags("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">NoteSphere</h1>
      <div className="mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="内容（Markdown対応）"
          className="w-full p-2 mb-2 border rounded h-32"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="タグ（カンマ区切り）"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="grid gap-4">
          {notes?.map((note) => (
            <div key={note.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-gray-600">{note.content}</p>
              <p className="text-sm text-gray-500">{note.tags.join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Notes() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotesPage />
    </QueryClientProvider>
  );
}