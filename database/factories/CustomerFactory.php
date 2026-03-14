<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Faker\Provider\en_IN\Address;
use Faker\Provider\en_IN\PhoneNumber;
use Faker\Provider\en_IN\Person;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    public function definition(): array
    {
        fake()->addProvider(new Person(fake()));
        fake()->addProvider(new PhoneNumber(fake()));
        fake()->addProvider(new Address(fake()));
        $installationDate = fake()->date();
        $serviceInterval = random_int(1, 1826);
        $lastServiceDate = null;
        $nextServiceDate = null;
        if ($installationDate >= date('Y-m-d')) {
            $nextServiceDate = Carbon::parse($installationDate)->addDays($serviceInterval)->format('Y-m-d');
        }else{
            $lastServiceDate = Carbon::parse($installationDate)->subDays($serviceInterval)->format('Y-m-d');
            $nextServiceDate = Carbon::parse($lastServiceDate)->addDays($serviceInterval)->format('Y-m-d');
        }

        return [
            'name' => fake()->name(),
            'contact_number' => fake()->phoneNumber(),
            'alternate_contact_number' => fake()->boolean() ? fake()->phoneNumber() : null,
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'product_model' => Str::random(10),
            'installation_date' => $installationDate,
            'service_interval' => $serviceInterval,
            'notes' => fake()->boolean() ? fake()->text() : null,
            'last_service_date' => $lastServiceDate,
            'next_service_date' => $nextServiceDate,
            'created_by_id' => User::inRandomOrder()->first()->id,
            'updated_by_id' => $lastServiceDate ? User::inRandomOrder()->first()->id : null,
        ];
    }
}
