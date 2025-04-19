<?php

namespace App\Http\Controllers;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller {
    public function index() {
        return Note::where('user_id', auth()->id())->get();
    }

    public function store(Request $request) {
        $note = Note::create(array_merge(
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'tags' => 'array',
            ]),
            ['user_id' => auth()->id()]
        ));
        return response()->json($note, 201);
    }
}
