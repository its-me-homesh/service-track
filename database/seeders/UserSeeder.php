<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@servicetrack.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Technician',
                'email' => 'technician@servicetrack.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Operator',
                'email' => 'operator@servicetrack.com',
                'password' => Hash::make('password'),
            ]
        ];

        foreach ($users as $user) {
            $user = User::updateOrCreate([
                'email' => $user['email'],
            ], $user);

            if ($user->name == 'Admin'){
                $user->assignRole('Admin');
            }
            if ($user->name == 'Technician'){
                $user->assignRole('Technician');
            }
            if ($user->name == 'Operator'){
                $user->assignRole('Operator');
            }
        }
    }
}
