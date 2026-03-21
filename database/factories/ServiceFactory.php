<?php

namespace Database\Factories;

use App\Enums\ServiceStatus;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_id' => Customer::inRandomOrder()->first()->id,
            'assigned_to_id' => fake()->boolean() ? User::inRandomOrder()->first()->id : null,
            'service_date' => fake()->date(),
            'notes' => fake()->boolean() ? fake()->text() : null,
            'cost' => fake()->boolean() ? fake()->randomFloat(2, 100, 1000) : null,
            'status' => fake()->randomElement(ServiceStatus::values()),
            'created_by_id' => User::inRandomOrder()->first()->id,
            'updated_by_id' => fake()->boolean() ? User::inRandomOrder()->first()->id : null,
        ];
    }
}
