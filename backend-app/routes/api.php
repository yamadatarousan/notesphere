<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AuthController;

// 認証ルート
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

// ノートAPI（認証必須）
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('notes', NoteController::class);
});

// デフォルトのユーザー情報ルート
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });