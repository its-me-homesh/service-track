<?php

use App\Models\User;

test('settings root redirects to profile', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings')
        ->assertRedirect('/settings/profile');
});
