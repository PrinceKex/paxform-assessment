<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FormController extends Controller
{
    /**
     * Display a listing of the user's forms.
     */
    public function index()
    {
        $forms = auth()->user()->forms()
            ->latest()
            ->paginate(10);

        return FormResource::collection($forms);
    }

    /**
     * Store a newly created form in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'structure' => 'required|array',
            'is_published' => 'boolean',
        ]);

        $form = auth()->user()->forms()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'structure' => $validated['structure'],
            'is_published' => $validated['is_published'] ?? false,
        ]);

        return new FormResource($form);
    }

    /**
     * Display the specified form.
     */
    public function show(Form $form)
    {
        $this->authorize('view', $form);
        return new FormResource($form);
    }

    /**
     * Update the specified form in storage.
     */
    public function update(Request $request, Form $form)
    {
        $this->authorize('update', $form);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'structure' => 'sometimes|required|array',
            'is_published' => 'boolean',
        ]);

        $form->update($validated);

        return new FormResource($form);
    }

    /**
     * Remove the specified form from storage.
     */
    public function destroy(Form $form)
    {
        $this->authorize('delete', $form);
        
        $form->delete();
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Toggle the published status of the form.
     */
    public function togglePublish(Form $form)
    {
        $this->authorize('update', $form);
        
        $form->update([
            'is_published' => !$form->is_published
        ]);
        
        return new FormResource($form);
    }
}
