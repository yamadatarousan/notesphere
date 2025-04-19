// frontend-app/app/notes/__tests__/Notes.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Notes from "../page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

const queryClient = new QueryClient();

describe("Notes", () => {
  it("renders note form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Notes />
      </QueryClientProvider>
    );
    expect(screen.getByPlaceholderText("タイトル")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("内容（Markdown対応）")).toBeInTheDocument();
  });

  it("submits new note", async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: vi.fn().mockResolvedValue({}) });
    render(
      <QueryClientProvider client={queryClient}>
        <Notes />
      </QueryClientProvider>
    );
    fireEvent.change(screen.getByPlaceholderText("タイトル"), { target: { value: "Test Note" } });
    fireEvent.change(screen.getByPlaceholderText("内容（Markdown対応）"), { target: { value: "Content" } });
    fireEvent.click(screen.getByText("保存"));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/notes",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});