<?php

use Inertia\Testing\AssertableInertia as Assert;

test('home page renders login for guests', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
        );
});
