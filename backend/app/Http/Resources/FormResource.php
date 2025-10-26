<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FormResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'structure' => $this->structure,
            'is_published' => (bool) $this->is_published,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'deleted_at' => $this->when($this->deleted_at, function () {
                return $this->deleted_at->toIso8601String();
            }),
            'links' => [
                'self' => route('api.forms.show', $this->id),
                'update' => route('api.forms.update', $this->id),
                'delete' => route('api.forms.destroy', $this->id),
                'toggle_publish' => route('api.forms.toggle-publish', $this->id),
            ],
        ];
    }
}
