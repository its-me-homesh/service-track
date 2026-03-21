<?php

namespace App\Support\Comparisons;

class ChangeSetBuilder
{
    public function buildFrom(array $old, array $new, ?array $onlyFields = null): array
    {
        $changes = [];

        $fields = $onlyFields ?? array_unique([
            ...array_keys($old),
            ...array_keys($new),
        ]);

        foreach ($fields as $field) {
            $oldValue = $old[$field] ?? null;
            $newValue = $new[$field] ?? null;

            if ($this->valuesDiffer($oldValue, $newValue)) {
                $changes[$field] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }

        return $changes;
    }

    private function valuesDiffer(mixed $oldValue, mixed $newValue): bool
    {
        return $this->normalize($oldValue) !== $this->normalize($newValue);
    }

    private function normalize(mixed $value): mixed
    {
        if (is_bool($value) || is_null($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (string) $value;
        }

        return $value;
    }
}
