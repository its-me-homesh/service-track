<?php

use App\Models\Customer;
use App\Models\User;

it('redirects guests from search to login', function () {
    $response = $this->get(route('customers.search', ['term' => 'test']));

    $response->assertRedirect();
    $this->assertGuest();
});

it('returns matching customers for authenticated users', function () {
    $user = User::factory()->create();

    $customer = Customer::factory()->create([
        'created_by_id' => $user->id,
        'name' => 'Search Target',
    ]);

    $response = $this->actingAs($user)->get(route('customers.search', [
        'term' => 'Search Target',
    ]));

    $response->assertOk()
        ->assertJsonFragment([
            'id' => $customer->id,
            'name' => 'Search Target',
        ]);
});
